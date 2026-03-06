import { createElement, ReactNode, ReactElement, Fragment } from "react";
import { RenderAsEnum } from "typings/DynamicDataGridProps";

interface BodyProps {
    children: ReactNode;
    renderAs: RenderAsEnum;
}

export function Body(props: BodyProps): ReactElement {
    if (props.renderAs === "grid") {
        return (
            <div className="widget-datagrid-grid-body table-content" role="rowgroup">
                {props.children}
            </div>
        );
    }
    return <Fragment>{props.children}</Fragment>;
}
