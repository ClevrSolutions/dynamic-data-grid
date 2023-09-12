import { Component, ReactNode, createElement } from "react";
import { ObjectItem } from "mendix";
import classNames from "classnames";

import { TableContainerProps } from "../typings/TableProps";

import "./ui/Table.css";

export class Table extends Component<TableContainerProps> {
    getValue(cell?: ObjectItem): ReactNode {
        const { cellAttribute, cellWidgets, cellTextTemplate, showCellAs } = this.props;
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

    getCells(row: ObjectItem, rowIndex: number): ReactNode {
        const { dataSourceCell, referenceRow, referenceColumn, objectsDataSourceColumn, onClickRow } = this.props;
        const onClick = onClickRow ? (): void => onClickRow?.get(row).execute() : undefined;
        const cells = objectsDataSourceColumn.items?.map(column => {
            const cell = dataSourceCell.items?.find(
                i => referenceRow.get(i).value?.id === row.id && referenceColumn.get(i).value?.id === column.id
            );
            return (
                <div
                    className={classNames("td", { "td-borders": rowIndex === 0, clickable: !!onClick })}
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
                    {this.getValue(cell)}
                </div>
            );
        });
        return cells;
    }

    render(): ReactNode {
        const { attributeHeader, style, objectsDataSourceColumn, objectsDataSourceRow } = this.props;

        const headers = objectsDataSourceColumn.items?.map(column => (
            <div className="th" role="columnheader" key={column.id}>
                <div className="column-container">
                    <div className="column-header align-column-left">{attributeHeader?.get(column)?.value ?? ""}</div>
                </div>
            </div>
        ));
        const rowCount = objectsDataSourceRow.items?.length ?? 0;

        const rows = objectsDataSourceRow.items?.map((row, index) => (
            <div className="tr" role="row" key={`row_${row.id}`}>
                {this.getCells(row, index)}
            </div>
        ));
        const columnCount = objectsDataSourceColumn.items?.length || 0;

        const rowStyle = { gridTemplateColumns: "1fr ".repeat(columnCount) };

        const emptyPlaceholderRenderer = (
            <div
                key="row-footer"
                className="td td-borders"
                style={{
                    gridColumn: `span ${columnCount}`
                }}
            >
                <div className="empty-placeholder">
                    {this.props.showEmptyPlaceholder === "custom" ? this.props.emptyPlaceholder : <div />}
                </div>
            </div>
        );

        return (
            <div className={classNames(this.props.class, "widget-table")} style={style}>
                <div className="table" role="table">
                    <div className="table-content" role="rowgroup" style={rowStyle}>
                        {headers}
                        {rows}
                        {rowCount === 0 && emptyPlaceholderRenderer}
                    </div>
                </div>
            </div>
        );
    }
}
