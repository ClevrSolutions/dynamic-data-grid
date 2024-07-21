import { createElement, ReactNode, ReactElement } from "react";
import classNames from "classnames";
import { RenderAsEnum } from "typings/DynamicDataGridProps";

interface RowHeaderProps {
    children: ReactNode;
    className?: string;
    key: string;
    onClick?: () => void;
    renderAs: RenderAsEnum;
    tooltipText?: string;
}

export function Header(props: RowHeaderProps): ReactElement {
    if (props.renderAs === "grid") {
        return (
            <div
                className={classNames("th", props.className, { clickable: !!props.onClick })}
                role="columnheader"
                key={props.key}
                onClick={props.onClick}
                title={props.tooltipText}
            >
                <div className="column-container">
                    <div className="column-header align-column-left">{props.children}</div>
                </div>
            </div>
        );
    }
    return (
        <th
            className={classNames(props.className, { clickable: !!props.onClick })}
            key={props.key}
            onClick={props.onClick}
        >
            {props.children}
        </th>
    );
}
