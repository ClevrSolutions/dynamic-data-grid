import { createElement, ReactNode, ReactElement } from "react";
import { RenderAsEnum, ShowEmptyPlaceholderEnum } from "../../typings/DynamicDataGridProps";

interface EmptyPlaceholderProps {
    emptyPlaceholder: ReactNode;
    showEmptyPlaceholder: ShowEmptyPlaceholderEnum;
    renderAs: RenderAsEnum;
    columnCount: number;
}

export function EmptyPlaceholder(props: EmptyPlaceholderProps): ReactElement {
    const { emptyPlaceholder, showEmptyPlaceholder, renderAs, columnCount } = props;
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
