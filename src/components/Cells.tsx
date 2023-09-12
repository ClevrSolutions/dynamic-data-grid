import { createElement, ReactNode } from "react";
import classNames from "classnames";
import { ObjectItem } from "mendix";
import { TableContainerProps } from "../../typings/TableProps";

function getCellValue(props: TableContainerProps, cell?: ObjectItem): ReactNode {
    const { cellAttribute, cellWidgets, cellTextTemplate, showCellAs } = props;
    let value: ReactNode = "";

    if (!cell) {
        return "";
    }
    if (showCellAs === "attribute") {
        value = cellAttribute?.get(cell)?.displayValue ?? "";
    } else if (showCellAs === "dynamicText") {
        value = cellTextTemplate?.get(cell)?.value ?? "";
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
        return "";
    }
    if (showRowAs === "attribute") {
        value = rowAttribute?.get(row)?.displayValue ?? "";
    } else if (showRowAs === "dynamicText") {
        value = rowTextTemplate?.get(row)?.value ?? "";
    } else if (showRowAs === "custom") {
        value = rowWidgets.get(row);
    } else {
        value = "n/a";
    }

    return value;
}

export function Cells(props: TableContainerProps, row: ObjectItem, rowIndex: number): ReactNode {
    const { dataSourceCell, referenceRow, referenceColumn, dataSourceColumn } = props;
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
            const cellClassColumn = columnClass?.get(column).value ?? "";
            const cellClassValue = cell ? cellClass?.get(cell).value ?? "" : "";
            return (
                <div
                    className={classNames("td", cellClassColumn, cellClassValue, {
                        "td-borders": rowIndex === 0,
                        clickable: !!onClick
                    })}
                    key={`row_${row.id}_cell_${column.id}`}
                    role={onClick ? "button" : "cell"}
                    onClick={onClick}
                    tabIndex={onClick ? 0 : undefined}
                    onKeyDown={
                        onClick
                            ? e => {
                                  if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
                                      e.preventDefault();
                                      onClick();
                                  }
                              }
                            : undefined
                    }
                >
                    {getCellValue(props, cell)}
                </div>
            );
        }) ?? [];
    if (showRowAs !== "none") {
        const onClick = onClickRowHeader
            ? (): void => onClickRowHeader?.get(row).execute()
            : onClickRow
            ? (): void => onClickRow?.get(row).execute()
            : undefined;
        cells.unshift(
            <div
                className={classNames("td", { "td-borders": rowIndex === 0, clickable: !!onClick })}
                key={`row_${row.id}_cell_header`}
                role={onClick ? "button" : "cell"}
                onClick={onClick}
                tabIndex={onClick ? 0 : undefined}
                onKeyDown={
                    onClick
                        ? e => {
                              if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
                                  e.preventDefault();
                                  onClick();
                              }
                          }
                        : undefined
                }
            >
                {getRowHeaderValue(props, row)}
            </div>
        );
    }
    return cells;
}
