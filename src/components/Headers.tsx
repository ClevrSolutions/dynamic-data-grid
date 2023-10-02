import { createElement, ReactNode, ReactElement, Fragment, useCallback } from "react";
import { ObjectItem } from "mendix";
import { Header } from "./Header";
import { DynamicDataGridContainerProps } from "../../typings/DynamicDataGridProps";

interface HeadersProps extends DynamicDataGridContainerProps {
    filterRenderer: FilterRenderer;
}

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

export type FilterRenderer = (
    renderWrapper: (children: ReactNode) => ReactElement,
    filterIndex: number
) => ReactElement;

export function Headers(props: HeadersProps): ReactElement {
    const { dataSourceColumn, showRowAs, showRowColumnNameAs, rowColumnNameWidgets, filters } = props;
    const { columnClass, onClickColumnHeader, onClickColumn, rowColumnNameTextTemplate, renderAs } = props;
    const { filterRenderer: filterRendererProp } = props;

    const filterRenderer = useCallback((children: ReactNode) => <div className="filter">{children}</div>, []);

    const headerSearch = filters.map((_filter, index) => (
        <div key={index}>{filterRendererProp(filterRenderer, index)}</div>
    ));

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
                {headerSearch}
            </Header>
        );
    }
    return <Fragment>{headers}</Fragment>;
}
