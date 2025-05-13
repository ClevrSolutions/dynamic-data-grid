import { createElement, ReactNode, ReactElement } from "react";
import classNames from "classnames";
import { OnClickTriggerEnum, RenderAsEnum } from "typings/DynamicDataGridProps";

interface CellProps {
    children: ReactNode;
    className?: string;
    key: string;
    clickTrigger: OnClickTriggerEnum;
    onClick?: () => void;
    rowIndex: number;
    renderAs: RenderAsEnum;
    tooltipText?: string;
}

export function Cell(props: CellProps): ReactElement {
    const { onClick, clickTrigger, className, key, tooltipText, children, renderAs } = props;
    if (renderAs === "grid") {
        return (
            <div
                className={classNames("td", className, {
                    "td-borders": props.rowIndex === 0,
                    clickable: !!onClick
                })}
                key={key}
                role={onClick ? "button" : "gridcell"}
                title={tooltipText}
                onClick={clickTrigger === "single" ? onClick : undefined}
                onDoubleClick={clickTrigger === "double" ? onClick : undefined}
                tabIndex={onClick ? 0 : undefined}
                onKeyDown={
                    onClick
                        ? e => {
                              if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget && onClick) {
                                  e.preventDefault();
                                  onClick();
                              }
                          }
                        : undefined
                }
            >
                {children}
            </div>
        );
    }
    return (
        <td
            className={className}
            key={key}
            title={tooltipText}
            onClick={clickTrigger === "single" ? onClick : undefined}
            onDoubleClick={clickTrigger === "double" ? onClick : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick
                    ? e => {
                          if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget && onClick) {
                              e.preventDefault();
                              onClick();
                          }
                      }
                    : undefined
            }
        >
            {children}
        </td>
    );
}
