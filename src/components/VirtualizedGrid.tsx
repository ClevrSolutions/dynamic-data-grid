import { ReactElement, createElement, ReactNode, useEffect } from "react";
// import classNames from "classnames";
import { AutoSizer, MultiGrid, GridCellRenderer } from "react-virtualized";
import classNames from "classnames";
import { getCellValue, getRowHeaderValue } from "./Cells";
import { Cell } from "./Cell";
import { getHeaderValue } from "./Headers";
import { DataSetMap } from "../DynamicDataGrid";

import { DynamicDataGridContainerProps } from "../../typings/DynamicDataGridProps";

import "react-virtualized/styles.css";

// const cache = new CellMeasurerCache({
//     defaultWidth: 100,
//     minWidth: 75,
//     fixedHeight: true
// });

// TODO
// - sizer for cell
// - table header class
// - Condition classes, refresh issue

interface VirtualizedGridProps extends DynamicDataGridContainerProps {
    cellDataset: DataSetMap;
    setRef: any;
}

export function VirtualizedGrid(props: VirtualizedGridProps): ReactElement {
    const { style, dataSourceColumn, dataSourceRow, showRowAs, rowClass, showHeaderAs } = props;
    const { onClickRow, onClickCell, onClickColumn, onClickRowHeader, onClickColumnHeader } = props;
    const { columnClass, cellClass } = props;

    // For some unknown reason this widget is wrapped in mxui.widget.Wrapper with an inline !important style
    // This prevents to measure the size of the parent. Dirty hack to fix the style.
    useEffect(() => {
        const parent = document.querySelector(`[data-mendix-id$="${props.name}"]`) as HTMLElement;
        if (parent) {
            parent.style.display = "block";
            parent.style.height = "100%";
        }
    }, [props.name]);

    const cellRenderer: GridCellRenderer = ({ columnIndex, key, rowIndex, style }) => {
        const rowIndexData = showHeaderAs === "none" ? rowIndex : rowIndex - 1;
        const columnIndexData = showRowAs === "none" ? columnIndex : columnIndex - 1;
        const row = dataSourceRow.items?.at(rowIndexData);
        const column = dataSourceColumn.items?.at(columnIndexData);
        let content: ReactNode = "(no data)";
        let onClick: (() => void) | undefined;
        let cellClassColumn: string | undefined;
        let cellClassValue: string | undefined;
        let cellClassRow: string | undefined;

        if (showRowAs !== "none" && columnIndex === 0 && showHeaderAs !== "none" && rowIndex === 0) {
            content =
                props.showRowColumnNameAs === "dynamicText"
                    ? props.rowColumnNameTextTemplate?.value ?? ""
                    : props.rowColumnNameWidgets;
        } else if (column && showHeaderAs !== "none" && rowIndex === 0) {
            content = getHeaderValue(props, column);
            onClick =
                column && onClickColumnHeader
                    ? (): void => onClickColumnHeader?.get(column).execute()
                    : onClickColumn
                    ? (): void => onClickColumn?.get(column).execute()
                    : undefined;
            cellClassColumn = classNames("th", columnClass?.get(column).value);
        } else if (row && showRowAs !== "none" && columnIndex === 0) {
            content = getRowHeaderValue(props, row);
            onClick = onClickRowHeader
                ? (): void => onClickRowHeader?.get(row).execute()
                : onClickRow
                ? (): void => onClickRow?.get(row).execute()
                : undefined;
            const oddEvenClass = rowIndexData % 2 === 0 ? "even" : "odd";
            cellClassRow = classNames("td", rowClass?.get(row).value, oddEvenClass);
        } else if (column && row) {
            const rowData = props.cellDataset[row.id];
            const cell = rowData ? rowData[column.id] : undefined;
            if (cell) {
                content = getCellValue(props, cell);
                onClick =
                    cell && onClickCell
                        ? (): void => onClickCell?.get(cell).execute()
                        : onClickRow
                        ? (): void => onClickRow?.get(row).execute()
                        : onClickColumn
                        ? (): void => onClickColumn?.get(column).execute()
                        : undefined;
                const oddEvenClass = rowIndexData % 2 === 0 ? "even" : "odd";
                cellClassColumn = columnClass?.get(column).value;
                cellClassRow = classNames("td", rowClass?.get(row).value, oddEvenClass);
                cellClassValue = cellClass?.get(cell).value;
            }
        }

        return (
            <Cell
                className={classNames(cellClassColumn, cellClassRow, cellClassValue)}
                key={key}
                clickTrigger={props.onClickTrigger}
                onClick={onClick}
                rowIndex={rowIndex}
                renderAs={props.renderAs}
                style={style}
            >
                {content}
            </Cell>
        );
    };

    const rowCount = dataSourceRow.items ? dataSourceRow.items.length + (showHeaderAs === "none" ? 0 : 1) : 0;
    const colCount = dataSourceColumn.items ? dataSourceColumn.items.length + (showRowAs === "none" ? 0 : 1) : 0;

    return (
        <AutoSizer disableHeight={props.gridHeight !== "max"} className="widget-table" style={style}>
            {({ height, width }) => (
                <MultiGrid
                    className="table"
                    ref={props.setRef}
                    cellRenderer={cellRenderer}
                    columnCount={colCount}
                    columnWidth={props.columnWidth}
                    fixedColumnCount={props.fixedColumnCount}
                    fixedRowCount={props.fixedRowCount}
                    height={props.gridHeight === "max" ? height : props.gridHeightPixels}
                    rowCount={rowCount}
                    rowHeight={props.rowHeight}
                    width={width}
                />
            )}
        </AutoSizer>
    );
}
