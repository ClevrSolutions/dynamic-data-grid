import { createElement, ReactNode, ReactElement } from "react";
import classNames from "classnames";
import { RenderAsEnum } from "typings/DynamicDataGridProps";

interface CellProps {
    children: ReactNode;
    className?: string;
    key: string;
    onClick?: () => void;
    rowIndex: number;
    renderAs: RenderAsEnum;
}

export function Cell(props: CellProps): ReactElement {
    if (props.renderAs === "grid") {
        return (
            <div
                className={classNames("td", props.className, {
                    "td-borders": props.rowIndex === 0,
                    clickable: !!props.onClick
                })}
                key={props.key}
                role={props.onClick ? "button" : "cell"}
                onClick={props.onClick}
                tabIndex={props.onClick ? 0 : undefined}
                onKeyDown={
                    props.onClick
                        ? e => {
                              if (
                                  (e.key === "Enter" || e.key === " ") &&
                                  e.target === e.currentTarget &&
                                  props.onClick
                              ) {
                                  e.preventDefault();
                                  props.onClick();
                              }
                          }
                        : undefined
                }
            >
                {props.children}
            </div>
        );
    }
    return (
        <td
            className={props.className}
            key={props.key}
            onClick={props.onClick}
            tabIndex={props.onClick ? 0 : undefined}
            onKeyDown={
                props.onClick
                    ? e => {
                          if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget && props.onClick) {
                              e.preventDefault();
                              props.onClick();
                          }
                      }
                    : undefined
            }
        >
            {props.children}
        </td>
    );
}
