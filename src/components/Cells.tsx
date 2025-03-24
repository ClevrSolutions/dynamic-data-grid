import { createElement, ReactNode, ReactElement, Fragment } from "react";
import classNames from "classnames";
import { ObjectItem } from "mendix";

import { Cell } from "./Cell";
import { DataSetMap } from "../DynamicDataGrid";
import { DynamicDataGridContainerProps } from "../../typings/DynamicDataGridProps";
import { Header } from "./Header";

export function getCellValue(props: DynamicDataGridContainerProps, cell?: ObjectItem): ReactNode {
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

function cellTooltipValue(props: DynamicDataGridContainerProps, cell?: ObjectItem): string {
    const { tooltipCell } = props;
    let value = "";

    if (!cell) {
        return "\u00A0";
    } else {
        value = tooltipCell?.get(cell)?.value ?? "\u00A0";
    }

    return value;
}
function rowTooltipValue(props: DynamicDataGridContainerProps, row?: ObjectItem): string {
    const { tooltipRow } = props;
    let value = "";

    if (!row) {
        return "\u00A0";
    } else {
        value = tooltipRow?.get(row)?.value ?? "\u00A0";
    }

    return value;
}

export function getRowHeaderValue(props: DynamicDataGridContainerProps, row?: ObjectItem): ReactNode {
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
    isHeader?: boolean;
    cellDataset: DataSetMap;
}

export function Cells(props: CellsProps): ReactElement {
    const { dataSourceColumn, renderAs, pageCell } = props;
    const { showRowAs, columnClass, cellClass } = props;
    const { row, rowIndex, isHeader, loading } = props;
    const { onClickTrigger, onClickRow, onClickCell, onClickColumn, onClickRowHeader } = props;

    // Potential optimize with hash table?
    const cells =
        dataSourceColumn.items?.map(column => {
            const rowData = props.cellDataset[row.id];
            const cell = rowData ? rowData[column.id] : undefined;
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
            if (isHeader) {
                return (
                    <Header
                        className={classNames(cellClassColumn, cellClassValue)}
                        tooltipText={cellTooltipValue(props, cell)}
                        clickTrigger={onClickTrigger}
                        onClick={onClick}
                        key={column.id}
                        renderAs={renderAs}
                    >
                        {getCellValue(props, cell)}
                    </Header>
                );
            }
            return (
                <Cell
                    className={classNames(cellClassColumn, cellClassValue)}
                    key={`row_${row.id}_coll_${column.id}_cell_${cell?.id}`}
                    tooltipText={cellTooltipValue(props, cell)}
                    clickTrigger={onClickTrigger}
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
        if (isHeader) {
            cells.unshift(
                <Header
                    key={`row_${row.id}_cell_header`}
                    tooltipText={rowTooltipValue(props, row)}
                    clickTrigger={onClickTrigger}
                    onClick={onClick}
                    renderAs={renderAs}
                >
                    {getRowHeaderValue(props, row)}
                </Header>
            );
        } else {
            cells.unshift(
                <Cell
                    key={`row_${row.id}_cell_header`}
                    tooltipText={rowTooltipValue(props, row)}
                    clickTrigger={onClickTrigger}
                    onClick={onClick}
                    rowIndex={rowIndex}
                    renderAs={renderAs}
                >
                    {getRowHeaderValue(props, row)}
                </Cell>
            );
        }
    }

    return <Fragment>{cells}</Fragment>;
}
