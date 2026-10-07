"""Remove daily records for a specific date while preserving workbook formatting."""

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
        return (dt.date(1899, 12, 30) + dt.timedelta(days=int(float(value)))).replace()
    except (TypeError, ValueError, OverflowError):
        return None


def date_cell_value(row: ET.Element) -> str:
    for cell in row.findall("x:c", NS):
        if cell.get("r", "").startswith("A"):
            return cell.findtext("x:v", default="", namespaces=NS)
    return ""


def remove_date(master_path: Path, target_date: dt.date) -> None:
    replacements: dict[str, bytes] = {}
    report: list[tuple[str, int]] = []
    with zipfile.ZipFile(master_path) as archive:
        for index, sheet in enumerate(["TURNO A", "TURNO B", "TURNO C", "TURNO D", "TURNO E", "TURNO F"], start=1):
            member = f"xl/worksheets/sheet{index}.xml"
            root = ET.fromstring(archive.read(member))
            sheet_data = root.find("x:sheetData", NS)
            removed = 0
            for row in list(sheet_data.findall("x:row", NS)):
                if excel_date(date_cell_value(row)) == target_date:
                    sheet_data.remove(row)
                    removed += 1
            replacements[member] = ET.tostring(root, encoding="utf-8", xml_declaration=True)
            report.append((sheet, removed))

        with tempfile.NamedTemporaryFile(dir=master_path.parent, suffix=".xlsx", delete=False) as temporary:
            temporary_path = Path(temporary.name)
        try:
            with zipfile.ZipFile(master_path) as original, zipfile.ZipFile(temporary_path, "w", zipfile.ZIP_DEFLATED) as output:
                for item in original.infolist():
                    output.writestr(item, replacements.get(item.filename, original.read(item.filename)))
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

    for sheet, removed in report:
        if removed:
            print(f"{sheet}: {removed} record removed")
    print(f"Total removed: {sum(removed for _, removed in report)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--master", required=True, type=Path)
    parser.add_argument("--date", required=True, type=dt.date.fromisoformat)
    arguments = parser.parse_args()
    remove_date(arguments.master, arguments.date)
