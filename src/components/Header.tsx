import { createElement, ReactNode, ReactElement, MouseEvent } from "react";
import classNames from "classnames";
import { OnClickTriggerEnum, RenderAsEnum } from "typings/DynamicDataGridProps";

interface RowHeaderProps {
    children: ReactNode;
    className?: string;
    key: string;
    tooltipText?: string;
    clickTrigger?: OnClickTriggerEnum;
    onClick?: (event?: MouseEvent) => void;
    renderAs: RenderAsEnum;
}

export function Header(props: RowHeaderProps): ReactElement {
    const { onClick, clickTrigger, className, key, tooltipText, children, renderAs } = props;
    if (renderAs === "grid") {
        return (
            <div
                className={classNames("th", className, { clickable: !!onClick })}
                role="columnheader"
                key={key}
                title={tooltipText}
                onClick={clickTrigger === "single" ? onClick : undefined}
                onDoubleClick={clickTrigger === "double" ? onClick : undefined}
            >
                <div className="column-container">
                    <div className="column-header align-column-left">{children}</div>
                </div>
            </div>
        );
    }
    return (
        <th
            className={classNames(className, { clickable: !!onClick })}
            key={key}
            title={tooltipText}
            onClick={clickTrigger === "single" ? onClick : undefined}
            onDoubleClick={clickTrigger === "double" ? onClick : undefined}
        >
            {children}
        </th>
    );
}
