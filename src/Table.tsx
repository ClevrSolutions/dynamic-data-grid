import { Component, ReactNode, createElement } from "react";
import { Header } from "./components/Header";
import { EmptyPlaceholder } from "./components/EmptyPlaceholder";
import { Cells } from "./components/Cells";

import classNames from "classnames";

import { TableContainerProps } from "../typings/TableProps";

import "./ui/Table.css";

export class Table extends Component<TableContainerProps> {
    render(): ReactNode {
        const { style, dataSourceColumn, dataSourceRow, showRowAs, rowClass } = this.props;

        const rowCount = dataSourceRow.items?.length ?? 0;

        const rows = dataSourceRow.items?.map((row, index) => (
            <div className={classNames("tr", rowClass?.get(row).value ?? "")} role="row" key={`row_${row.id}`}>
                {Cells(this.props, row, index)}
            </div>
        ));

        let columnCount = dataSourceColumn.items?.length || 0;
        if (showRowAs !== "none") {
            columnCount += 1;
        }

        const rowStyle = { gridTemplateColumns: "1fr ".repeat(columnCount) };
        return (
            <div className={classNames(this.props.class, "widget-table")} style={style}>
                <div className="table" role="table">
                    <div className="table-content" role="rowgroup" style={rowStyle}>
                        {Header(this.props)}
                        {rows}
                        {rowCount === 0 && EmptyPlaceholder(this.props, columnCount)}
                    </div>
                </div>
            </div>
        );
    }
}
