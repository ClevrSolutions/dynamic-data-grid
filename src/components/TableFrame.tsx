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
                <div className="widget-datagrid-top-bar table-header">
                    {props.paging &&
                        (props.pagingPosition === "top" || props.pagingPosition === "both") &&
                        props.pagination}
                </div>
                <div className="widget-datagrid-content">
                    <div className="widget-datagrid-grid table" role="grid" style={rowStyle}>
                        {props.children}
                    </div>
                </div>
                <div className="widget-datagrid-footer table-footer">
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
