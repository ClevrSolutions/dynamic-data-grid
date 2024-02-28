import { createElement, ReactNode, ReactElement, Fragment } from "react";
import classNames from "classnames";
import { ObjectItem } from "mendix";
import { Cell } from "./Cell";
import { DynamicDataGridContainerProps } from "../../typings/DynamicDataGridProps";

function getCellValue(props: DynamicDataGridContainerProps, cell?: ObjectItem): ReactNode {
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

function getRowHeaderValue(props: DynamicDataGridContainerProps, row?: ObjectItem): ReactNode {
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

interface CellsProps extends DynamicDataGridContainerProps {
    row: ObjectItem;
    rowIndex: number;
    loading: boolean;
}

export function Cells(props: CellsProps): ReactElement {
    const { dataSourceCell, referenceRow, referenceColumn, dataSourceColumn, renderAs, pageCell } = props;
    const { showRowAs, columnClass, cellClass } = props;
    const { row, rowIndex, loading } = props;
    const { onClickRow, onClickCell, onClickColumn, onClickRowHeader } = props;
    // potential optimize with hash table?
    const cells =
        dataSourceColumn.items?.map(column => {
            const cell = dataSourceCell.items?.find(
                i => referenceRow.get(i).value?.id === row.id && referenceColumn.get(i).value?.id === column.id
            );
            if (pageCell && cell === undefined && !loading) {
                console.error(
                    `Dynamic Data Grid widget - No cell found for row ${row.id} column ${column.id} while 'Optimize cell paging' is enabled.
Please make sure your cell sort order and row sort order are matching, and cell do exists, or switch of the 'Optimize cell paging' option.`
                );
            }

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
                    key={`row_${row.id}_coll_${column.id}_cell_${cell?.id}`}
                    onClick={onClick}
                    rowIndex={rowIndex}
                    renderAs={renderAs}
                    isRowHeader={false}
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
            <Cell
                key={`row_${row.id}_cell_header`}
                onClick={onClick}
                rowIndex={rowIndex}
                renderAs={renderAs}
                isRowHeader={props.isRowHeader.get(row).value as boolean}
            >
                {getRowHeaderValue(props, row)}
            </Cell>
        );
    }
    return <Fragment>{cells}</Fragment>;
}
