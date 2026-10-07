"""Append new daily audit rows to the published master workbook without altering its layout."""

from __future__ import annotations

import argparse
import copy
import os
import re
import shutil
import tempfile
import zipfile
from decimal import Decimal
from pathlib import Path
from xml.etree import ElementTree as ET

MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
XML_NS = "http://www.w3.org/XML/1998/namespace"
NS = {"x": MAIN_NS}
CELL_REF = re.compile(r"([A-Z]+)(\d+)$")


def q(name: str) -> str:
    return f"{{{MAIN_NS}}}{name}"


def column_number(reference: str) -> int:
    match = CELL_REF.match(reference)
    letters = match.group(1) if match else ""
    value = 0
    for letter in letters:
        value = value * 26 + ord(letter) - 64
    return value


def text_content(element: ET.Element | None) -> str:
    return "" if element is None else "".join(element.itertext())


def shared_strings(archive: zipfile.ZipFile) -> list[str]:
    try:
        root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    return [text_content(item) for item in root.findall("x:si", NS)]


def cell_value(cell: ET.Element | None, strings: list[str]) -> str:
    if cell is None:
        return ""
    cell_type = cell.get("t")
    if cell_type == "s":
        value = cell.findtext("x:v", default="", namespaces=NS)
        return strings[int(value)] if value else ""
    if cell_type == "inlineStr":
        return text_content(cell.find("x:is", NS))
    return cell.findtext("x:v", default="", namespaces=NS)


def date_key(value: str) -> str:
    try:
        return str(int(Decimal(value)))
    except Exception:
        return ""


def rows_by_number(sheet: ET.Element) -> dict[int, ET.Element]:
    return {int(row.get("r")): row for row in sheet.findall("x:sheetData/x:row", NS)}


def cells_by_column(row: ET.Element) -> dict[str, ET.Element]:
    result: dict[str, ET.Element] = {}
    for cell in row.findall("x:c", NS):
        match = CELL_REF.match(cell.get("r", ""))
        if match:
            result[match.group(1)] = cell
    return result


def inline_cell(reference: str, style: str | None, value: str) -> ET.Element:
    attributes = {"r": reference, "t": "inlineStr"}
    if style is not None:
        attributes["s"] = style
    cell = ET.Element(q("c"), attributes)
    inline = ET.SubElement(cell, q("is"))
    text = ET.SubElement(inline, q("t"))
    if value[:1].isspace() or value[-1:].isspace():
        text.set(f"{{{XML_NS}}}space", "preserve")
    text.text = value
    return cell


def numeric_cell(reference: str, style: str | None, value: str) -> ET.Element:
    attributes = {"r": reference}
    if style is not None:
        attributes["s"] = style
    cell = ET.Element(q("c"), attributes)
    ET.SubElement(cell, q("v")).text = value
    return cell


def append_daily_rows(master_xml: bytes, source_xml: bytes, master_strings: list[str], source_strings: list[str]) -> tuple[bytes, int, list[str]]:
    master = ET.fromstring(master_xml)
    source = ET.fromstring(source_xml)
    master_rows = rows_by_number(master)
    source_rows = rows_by_number(source)
    master_data = master.find("x:sheetData", NS)

    existing_dates: set[str] = set()
    used_rows: list[int] = []
    for number, row in master_rows.items():
        cells = cells_by_column(row)
        value = cell_value(cells.get("A"), master_strings)
        if value:
            used_rows.append(number)
        key = date_key(value)
        if key:
            existing_dates.add(key)

    template_row = next((master_rows[number] for number in sorted(master_rows) if date_key(cell_value(cells_by_column(master_rows[number]).get("A"), master_strings))), None)
    if template_row is None:
        raise ValueError("The master worksheet does not contain a daily row to use as a format template.")
    template_styles = {column: cell.get("s") for column, cell in cells_by_column(template_row).items()}
    destination = max(used_rows, default=1) + 1
    added: list[str] = []

    for number in sorted(source_rows):
        source_cells = cells_by_column(source_rows[number])
        date_value = cell_value(source_cells.get("A"), source_strings)
        key = date_key(date_value)
        if not key or key in existing_dates:
            continue
        target_row = master_rows.get(destination)
        if target_row is None:
            target_row = ET.Element(q("row"), {"r": str(destination), "ht": "17.25", "customHeight": "1"})
            master_data.append(target_row)
            master_rows[destination] = target_row
        target_row.set("r", str(destination))
        for cell in list(target_row.findall("x:c", NS)):
            if column_number(cell.get("r", "")) <= 9:
                target_row.remove(cell)
        for column in "ABCDEFGHI":
            value = cell_value(source_cells.get(column), source_strings)
            reference = f"{column}{destination}"
            style = template_styles.get(column)
            cell = inline_cell(reference, style, value) if column in {"B", "C"} else numeric_cell(reference, style, value)
            target_row.append(cell)
        ordered_cells = sorted(target_row.findall("x:c", NS), key=lambda cell: column_number(cell.get("r", "")))
        for cell in list(target_row.findall("x:c", NS)):
            target_row.remove(cell)
        target_row.extend(ordered_cells)
        existing_dates.add(key)
        added.append(date_value)
        destination += 1

    return ET.tostring(master, encoding="utf-8", xml_declaration=True), len(added), added


def merge(source_path: Path, master_path: Path, apply: bool) -> None:
    with zipfile.ZipFile(source_path) as source_archive, zipfile.ZipFile(master_path) as master_archive:
        master_strings = shared_strings(master_archive)
        source_strings = shared_strings(source_archive)
        replacements: dict[str, bytes] = {}
        report: list[tuple[str, int, list[str]]] = []
        for index, sheet_name in enumerate(["TURNO A", "TURNO B", "TURNO C", "TURNO D", "TURNO E ", "TURNO F"], start=1):
            member = f"xl/worksheets/sheet{index}.xml"
            xml, count, dates = append_daily_rows(master_archive.read(member), source_archive.read(member), master_strings, source_strings)
            replacements[member] = xml
            report.append((sheet_name.strip(), count, dates))

        for sheet, count, dates in report:
            print(f"{sheet}: {count} daily rows added" + (f" ({', '.join(dates)})" if dates else ""))
        total = sum(count for _, count, _ in report)
        print(f"Total: {total} new daily rows")
        if not apply:
            print("Dry run only: the master workbook was not changed.")
            return

        with tempfile.NamedTemporaryFile(dir=master_path.parent, suffix=".xlsx", delete=False) as temporary:
            temporary_path = Path(temporary.name)
        try:
            with zipfile.ZipFile(master_path) as original, zipfile.ZipFile(temporary_path, "w", zipfile.ZIP_DEFLATED) as output:
                for item in original.infolist():
                    output.writestr(item, replacements.get(item.filename, original.read(item.filename)))
            try:
                os.replace(temporary_path, master_path)
            except PermissionError:
                # Vite's file watcher can prevent an atomic rename on Windows. Keep a
                # recoverable copy while falling back to an in-place replacement.
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
        print(f"Master workbook updated: {master_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--master", required=True, type=Path)
    parser.add_argument("--apply", action="store_true")
    arguments = parser.parse_args()
    merge(arguments.source, arguments.master, arguments.apply)
