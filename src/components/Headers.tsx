import { createElement, ReactNode, ReactElement, Fragment } from "react";
import { ObjectItem } from "mendix";
import { Header } from "./Header";
import { DynamicDataGridContainerProps } from "../../typings/DynamicDataGridProps";

function getHeaderValue(column: ObjectItem, props: DynamicDataGridContainerProps): ReactNode {
    const { headerAttribute, headerWidgets, headerTextTemplate, showHeaderAs } = props;
    let value: ReactNode = "";

    if (!column) {
        return "\u00A0";
    }
    if (showHeaderAs === "attribute") {
        value = headerAttribute?.get(column)?.displayValue ?? "\u00A0";
    } else if (showHeaderAs === "dynamicText") {
        value = headerTextTemplate?.get(column)?.value ?? "\u00A0";
    } else if (showHeaderAs === "custom") {
        value = headerWidgets.get(column);
    } else {
        value = "n/a";
    }

    return value;
}
function tooltipValue(column: ObjectItem, props: DynamicDataGridContainerProps): string {
    const { tooltipColumn } = props;
    let value = "";

    if (!column) {
        return "\u00A0";
    } else {
        value = tooltipColumn?.get(column)?.value ?? "\u00A0";
    }

    return value;
}

export function Headers(props: DynamicDataGridContainerProps): ReactElement {
    const { dataSourceColumn, showRowAs, showRowColumnNameAs, rowColumnNameWidgets } = props;
    const { columnClass, onClickColumnHeader, onClickColumn, rowColumnNameTextTemplate, renderAs } = props;

    const headers =
        dataSourceColumn.items?.map(column => {
            const onClick =
                column && onClickColumnHeader
                    ? (): void => onClickColumnHeader?.get(column).execute()
                    : onClickColumn
                    ? (): void => onClickColumn?.get(column).execute()
                    : undefined;
            return (
                <Header
                    className={columnClass?.get(column).value ?? ""}
                    onClick={onClick}
                    key={column.id}
                    renderAs={renderAs}
                    tooltipText={tooltipValue(column, props)}
                >
                    {getHeaderValue(column, props)}
                </Header>
            );
        }) ?? [];
    if (showRowAs !== "none") {
        const columnName =
            showRowColumnNameAs === "dynamicText" ? rowColumnNameTextTemplate?.value ?? "" : rowColumnNameWidgets;
        headers?.unshift(
            <Header key="row_header" renderAs={renderAs}>
                {columnName}
            </Header>
        );
    }
    return <Fragment>{headers}</Fragment>;
}
