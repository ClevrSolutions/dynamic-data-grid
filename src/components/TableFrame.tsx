import { createElement, ReactNode, ReactElement, CSSProperties } from "react";
import classNames from "classnames";
import { RenderAsEnum, PagingPositionEnum } from "typings/DynamicDataGridProps";

interface TableFrameProps {
    children: ReactNode;
    className: string;
    style?: CSSProperties | undefined;
    columnCount: number;
    renderAs: RenderAsEnum;
    pagingPosition: PagingPositionEnum;
    paging: boolean;
    pagination: ReactNode;
}

export function TableFrame(props: TableFrameProps): ReactElement {
    if (props.renderAs === "grid") {
        const rowStyle = { gridTemplateColumns: "1fr ".repeat(props.columnCount) };
        return (
            <div className={classNames(props.className, "widget-dynamic-data-grid")} style={props.style}>
                <div className="table-header">
                    {props.paging &&
                        (props.pagingPosition === "top" || props.pagingPosition === "both") &&
                        props.pagination}
                </div>
                <div className="table" role="table">
                    <div className="table-content" role="rowgroup" style={rowStyle}>
                        {props.children}
                    </div>
                </div>
                <div className="table-footer">
                    {props.paging &&
                        (props.pagingPosition === "bottom" || props.pagingPosition === "both") &&
                        props.pagination}
                </div>
            </div>
        );
    }
    return (
        <table className={classNames(props.className, "widget-dynamic-data-grid")} style={props.style}>
            {props.children}
        </table>
    );
}
