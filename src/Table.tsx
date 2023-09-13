import { Component, ReactNode, createElement } from "react";
import { Headers } from "./components/Headers";
import { Row } from "./components/Row";
import { TableFrame } from "./components/TableFrame";
import { EmptyPlaceholder } from "./components/EmptyPlaceholder";
import { Cells } from "./components/Cells";

import { TableContainerProps } from "../typings/TableProps";

import "./ui/Table.css";

export class Table extends Component<TableContainerProps> {
    render(): ReactNode {
        const { style, dataSourceColumn, dataSourceRow, showRowAs, rowClass, renderAs } = this.props;
        const rows = dataSourceRow.items ?? [];

        let columnCount = dataSourceColumn.items?.length || 0;
        if (showRowAs !== "none") {
            columnCount += 1;
        }

        return (
            <TableFrame columnCount={columnCount} className={this.props.class} style={style} renderAs={renderAs}>
                <Row key="header" renderAs={renderAs}>
                    {Headers(this.props)}
                </Row>
                {rows.map((row, index) => (
                    <Row className={rowClass?.get(row).value ?? ""} key={row.id} renderAs={renderAs}>
                        {Cells(this.props, row, index)}
                    </Row>
                ))}
                {rows.length === 0 && EmptyPlaceholder(this.props, columnCount)}
            </TableFrame>
        );
    }
}
