import { createElement, ReactNode } from "react";
import classNames from "classnames";
import { ObjectItem } from "mendix";
import { Cell } from "./Cell";
import { TableContainerProps } from "../../typings/TableProps";

function getCellValue(props: TableContainerProps, cell?: ObjectItem): ReactNode {
    const { cellAttribute, cellWidgets, cellTextTemplate, showCellAs } = props;
    let value: ReactNode = "";

    if (!cell) {
        return "\u00A0";
    }
    if (showCellAs === "attribute") {
        value = cellAttribute?.get(cell)?.displayValue ?? "\u00A0";
    } else if (showCellAs === "dynamicText") {
        value = cellTextTemplate?.get(cell)?.value ?? "\u00A0";
    } else if (showCellAs === "custom") {
        value = cellWidgets.get(cell);
    } else {
        value = "n/a";
    }

    return value;
}

function getRowHeaderValue(props: TableContainerProps, row?: ObjectItem): ReactNode {
    const { rowAttribute, rowWidgets, rowTextTemplate, showRowAs } = props;
    let value: ReactNode = "";

    if (!row) {
        return "\u00A0";
    }
    if (showRowAs === "attribute") {
        value = rowAttribute?.get(row)?.displayValue ?? "\u00A0";
    } else if (showRowAs === "dynamicText") {
        value = rowTextTemplate?.get(row)?.value ?? "\u00A0";
    } else if (showRowAs === "custom") {
        value = rowWidgets.get(row);
    } else {
        value = "n/a";
    }

    return value;
}

export function Cells(props: TableContainerProps, row: ObjectItem, rowIndex: number): ReactNode {
    const { dataSourceCell, referenceRow, referenceColumn, dataSourceColumn, renderAs } = props;
    const { showRowAs, columnClass, cellClass } = props;
    const { onClickRow, onClickCell, onClickColumn, onClickRowHeader } = props;
    const cells =
        dataSourceColumn.items?.map(column => {
            const cell = dataSourceCell.items?.find(
                i => referenceRow.get(i).value?.id === row.id && referenceColumn.get(i).value?.id === column.id
            );

            const onClick =
                cell && onClickCell
                    ? (): void => onClickCell?.get(cell).execute()
                    : onClickRow
                    ? (): void => onClickRow?.get(row).execute()
                    : onClickColumn
                    ? (): void => onClickColumn?.get(column).execute()
                    : undefined;
            const cellClassColumn = columnClass?.get(column).value ?? undefined;
            const cellClassValue = (cell && cellClass?.get(cell).value) ?? undefined;
            return (
                <Cell
                    className={classNames(cellClassColumn, cellClassValue)}
                    key={`row_${row.id}_cell_${column.id}`}
                    onClick={onClick}
                    rowIndex={rowIndex}
                    renderAs={renderAs}
                >
                    {getCellValue(props, cell)}
                </Cell>
            );
        }) ?? [];
    if (showRowAs !== "none") {
        const onClick = onClickRowHeader
            ? (): void => onClickRowHeader?.get(row).execute()
            : onClickRow
            ? (): void => onClickRow?.get(row).execute()
            : undefined;
        cells.unshift(
            <Cell key={`row_${row.id}_cell_header`} onClick={onClick} rowIndex={rowIndex} renderAs={renderAs}>
                {getRowHeaderValue(props, row)}
            </Cell>
        );
    }
    return cells;
}
