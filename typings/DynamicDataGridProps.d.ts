/**
 * This file was generated from DynamicDataGrid.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { DynamicValue, ListValue, ListActionValue, ListAttributeValue, ListExpressionValue, ListReferenceValue, ListWidgetValue } from "mendix";

export type ShowCellAsEnum = "attribute" | "dynamicText" | "custom";

export type ShowRowAsEnum = "none" | "attribute" | "dynamicText" | "custom";

export type ShowRowColumnNameAsEnum = "dynamicText" | "custom";

export type ShowHeaderAsEnum = "none" | "firstRow" | "attribute" | "dynamicText" | "custom";

export type OnClickTriggerEnum = "single" | "double";

export type RenderAsEnum = "grid" | "table";

export type ShowEmptyPlaceholderEnum = "none" | "custom";

export type PagingEnum = "none" | "row" | "column";

export type PagingPositionEnum = "bottom" | "top" | "both";

export interface DynamicDataGridContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    dataSourceCell: ListValue;
    showCellAs: ShowCellAsEnum;
    cellWidgets: ListWidgetValue;
    cellTextTemplate: ListExpressionValue<string>;
    cellAttribute: ListAttributeValue<string>;
    tooltipCell?: ListExpressionValue<string>;
    cellClass?: ListExpressionValue<string>;
    referenceRow: ListReferenceValue;
    dataSourceRow: ListValue;
    showRowAs: ShowRowAsEnum;
    rowWidgets: ListWidgetValue;
    rowTextTemplate: ListExpressionValue<string>;
    rowAttribute: ListAttributeValue<string>;
    showRowColumnNameAs: ShowRowColumnNameAsEnum;
    rowColumnNameWidgets: ReactNode;
    rowColumnNameTextTemplate?: DynamicValue<string>;
    tooltipRow?: ListExpressionValue<string>;
    rowClass?: ListExpressionValue<string>;
    referenceColumn: ListReferenceValue;
    dataSourceColumn: ListValue;
    showHeaderAs: ShowHeaderAsEnum;
    headerAttribute: ListAttributeValue<string>;
    headerWidgets: ListWidgetValue;
    headerTextTemplate: ListExpressionValue<string>;
    tooltipColumn?: ListExpressionValue<string>;
    columnClass?: ListExpressionValue<string>;
    onClickTrigger: OnClickTriggerEnum;
    onClickRowHeader?: ListActionValue;
    onClickRow?: ListActionValue;
    onClickColumnHeader?: ListActionValue;
    onClickColumn?: ListActionValue;
    onClickCell?: ListActionValue;
    renderAs: RenderAsEnum;
    showEmptyPlaceholder: ShowEmptyPlaceholderEnum;
    emptyPlaceholder: ReactNode;
    paging: PagingEnum;
    pagingPosition: PagingPositionEnum;
    pageSize: number;
    pageCell: boolean;
}

export interface DynamicDataGridPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    dataSourceCell: {} | { caption: string } | { type: string } | null;
    showCellAs: ShowCellAsEnum;
    cellWidgets: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    cellTextTemplate: string;
    cellAttribute: string;
    tooltipCell: string;
    cellClass: string;
    referenceRow: string;
    dataSourceRow: {} | { caption: string } | { type: string } | null;
    showRowAs: ShowRowAsEnum;
    rowWidgets: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    rowTextTemplate: string;
    rowAttribute: string;
    showRowColumnNameAs: ShowRowColumnNameAsEnum;
    rowColumnNameWidgets: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    rowColumnNameTextTemplate: string;
    tooltipRow: string;
    rowClass: string;
    referenceColumn: string;
    dataSourceColumn: {} | { caption: string } | { type: string } | null;
    showHeaderAs: ShowHeaderAsEnum;
    headerAttribute: string;
    headerWidgets: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    headerTextTemplate: string;
    tooltipColumn: string;
    columnClass: string;
    onClickTrigger: OnClickTriggerEnum;
    onClickRowHeader: {} | null;
    onClickRow: {} | null;
    onClickColumnHeader: {} | null;
    onClickColumn: {} | null;
    onClickCell: {} | null;
    renderAs: RenderAsEnum;
    showEmptyPlaceholder: ShowEmptyPlaceholderEnum;
    emptyPlaceholder: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    paging: PagingEnum;
    pagingPosition: PagingPositionEnum;
    pageSize: number | null;
    pageCell: boolean;
}
