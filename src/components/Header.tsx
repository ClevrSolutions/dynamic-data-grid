import { createElement, ReactNode, ReactElement } from "react";
import classNames from "classnames";
import { RenderAsEnum } from "typings/DynamicDataGridProps";

interface RowHeaderProps {
    children: ReactNode;
    className?: string;
    key: string;
    tooltipText?: string;
    onClick?: () => void;
    renderAs: RenderAsEnum;
}

export function Header(props: RowHeaderProps): ReactElement {
    if (props.renderAs === "grid") {
        return (
            <div
                className={classNames("th", props.className, { clickable: !!props.onClick })}
                role="columnheader"
                key={props.key}
                title={props.tooltipText}
                onClick={props.onClick}
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
            title={props.tooltipText}
            onClick={props.onClick}
        >
            {props.children}
        </th>
    );
}
