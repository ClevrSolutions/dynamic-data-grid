import { createElement, ReactNode, ReactElement } from "react";
import classNames from "classnames";
import { RenderAsEnum } from "typings/TableProps";

interface RowProps {
    children: ReactNode;
    className?: string;
    key: string;
    renderAs: RenderAsEnum;
}

export function Row(props: RowProps): ReactElement {
    if (props.renderAs === "grid") {
        return (
            <div className={classNames("tr", props.className)} role="row" key={`row_${props.key}`}>
                {props.children}
            </div>
        );
    }
    return (
        <tr className={props.className} key={`row_${props.key}`}>
            {props.children}
        </tr>
    );
}
