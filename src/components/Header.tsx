import { createElement, ReactNode } from "react";
import classNames from "classnames";
import { ObjectItem } from "mendix";
import { TableContainerProps } from "../../typings/TableProps";

function getHeaderValue(column: ObjectItem, props: TableContainerProps): ReactNode {
    const { headerAttribute, headerWidgets, headerTextTemplate, showHeaderAs } = props;
    let value: ReactNode = "";

    if (!column) {
        return "";
    }
    if (showHeaderAs === "attribute") {
        value = headerAttribute?.get(column)?.displayValue ?? "";
    } else if (showHeaderAs === "dynamicText") {
        value = headerTextTemplate?.get(column)?.value ?? "";
    } else if (showHeaderAs === "custom") {
        value = headerWidgets.get(column);
    } else {
        value = "n/a";
    }

    return value;
}

export function Header(props: TableContainerProps): ReactNode {
    const { dataSourceColumn, showRowAs } = props;
    const { columnClass, onClickColumnHeader, onClickColumn, rowColumnNameTextTemplate } = props;

    const headers = dataSourceColumn.items?.map(column => {
        const onClick =
            column && onClickColumnHeader
                ? (): void => onClickColumnHeader?.get(column).execute()
                : onClickColumn
                ? (): void => onClickColumn?.get(column).execute()
                : undefined;
        return (
            <div
                className={classNames("th", columnClass?.get(column).value ?? "", { clickable: !!onClick })}
                role="columnheader"
                key={column.id}
                onClick={onClick}
            >
                <div className="column-container">
                    <div className="column-header align-column-left">{getHeaderValue(column, props)}</div>
                </div>
            </div>
        );
    });
    if (showRowAs !== "none") {
        const columnName = rowColumnNameTextTemplate?.value ?? "";
        headers?.unshift(
            <div className="th" role="columnheader" key="row_header">
                <div className="column-container">
                    <div className="column-header align-column-left">{columnName}</div>
                </div>
            </div>
        );
    }
    return headers;
}
