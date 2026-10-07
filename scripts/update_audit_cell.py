"""Update one numeric cell in the master workbook without rewriting its formatting."""

from __future__ import annotations

import argparse
import datetime as dt
import os
import shutil
import tempfile
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
NS = {"x": MAIN_NS}


def excel_date(value: str) -> dt.date | None:
    try:
        return dt.date(1899, 12, 30) + dt.timedelta(days=int(float(value)))
    except (TypeError, ValueError, OverflowError):
        return None


def update_cell(master_path: Path, sheet_index: int, target_date: dt.date, column: str, value: str) -> None:
    member = f"xl/worksheets/sheet{sheet_index}.xml"
    with zipfile.ZipFile(master_path) as archive:
        root = ET.fromstring(archive.read(member))
        updated = False
        for row in root.findall("x:sheetData/x:row", NS):
            cells = {cell.get("r", "").rstrip("0123456789"): cell for cell in row.findall("x:c", NS)}
            date_value = cells.get("A").findtext("x:v", default="", namespaces=NS) if cells.get("A") is not None else ""
            if excel_date(date_value) != target_date:
                continue
            cell = cells.get(column)
            if cell is None:
                raise ValueError(f"Column {column} does not exist for {target_date.isoformat()}")
            formula = cell.find("x:f", NS)
            if formula is not None:
                cell.remove(formula)
            raw_value = cell.find("x:v", NS)
            if raw_value is None:
                raw_value = ET.SubElement(cell, f"{{{MAIN_NS}}}v")
            raw_value.text = value
            updated = True
            break
        if not updated:
            raise ValueError(f"No record found for {target_date.isoformat()} in sheet {sheet_index}")
        replacement = ET.tostring(root, encoding="utf-8", xml_declaration=True)

        with tempfile.NamedTemporaryFile(dir=master_path.parent, suffix=".xlsx", delete=False) as temporary:
            temporary_path = Path(temporary.name)
        try:
            with zipfile.ZipFile(master_path) as original, zipfile.ZipFile(temporary_path, "w", zipfile.ZIP_DEFLATED) as output:
                for item in original.infolist():
                    output.writestr(item, replacement if item.filename == member else original.read(item.filename))
            try:
                os.replace(temporary_path, master_path)
            except PermissionError:
                with tempfile.NamedTemporaryFile(dir=master_path.parent, suffix=".xlsx", delete=False) as backup:
                    backup_path = Path(backup.name)
                try:
                    shutil.copy2(master_path, backup_path)
                    shutil.copy2(temporary_path, master_path)
                except Exception:
                    if backup_path.exists():
                        shutil.copy2(backup_path, master_path)
                    raise
                finally:
                    if backup_path.exists():
                        backup_path.unlink()
        finally:
            if temporary_path.exists():
                temporary_path.unlink()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--master", required=True, type=Path)
    parser.add_argument("--sheet-index", required=True, type=int)
    parser.add_argument("--date", required=True, type=dt.date.fromisoformat)
    parser.add_argument("--column", required=True)
    parser.add_argument("--value", required=True)
    arguments = parser.parse_args()
    update_cell(arguments.master, arguments.sheet_index, arguments.date, arguments.column.upper(), arguments.value)
    print(f"Updated sheet {arguments.sheet_index}, {arguments.date.isoformat()}, column {arguments.column.upper()} = {arguments.value}")
