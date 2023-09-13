import { createElement, ReactNode } from "react";
import { TableContainerProps } from "../../typings/TableProps";

export function EmptyPlaceholder(props: TableContainerProps, columnCount: number): ReactNode {
    const { emptyPlaceholder, showEmptyPlaceholder, renderAs } = props;
    if (renderAs === "grid") {
        return (
            <div
                key="row-footer"
                className="td td-borders"
                style={{
                    gridColumn: `span ${columnCount}`
                }}
            >
                <div className="empty-placeholder">
                    {showEmptyPlaceholder === "custom" ? emptyPlaceholder : <div />}
                </div>
            </div>
        );
    }
    return (
        <tr>
            <td>{showEmptyPlaceholder === "custom" ? emptyPlaceholder : "\u00A0"}</td>
        </tr>
    );
}
