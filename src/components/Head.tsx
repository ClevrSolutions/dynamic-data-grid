import { createElement, ReactNode, ReactElement, Fragment } from "react";
import { RenderAsEnum } from "typings/DynamicDataGridProps";

interface HeadProps {
    children: ReactNode;
    renderAs: RenderAsEnum;
}

export function Head(props: HeadProps): ReactElement {
    if (props.renderAs === "grid") {
        return (
            <div className="widget-datagrid-grid-head" role="rowgroup">
                {props.children}
            </div>
        );
    }
    return <Fragment>{props.children}</Fragment>;
}
