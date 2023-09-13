/**
 * This file was generated from Table.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { DynamicValue, ListValue, ListActionValue, ListAttributeValue, ListExpressionValue, ListReferenceValue, ListWidgetValue } from "mendix";

export type ShowCellAsEnum = "attribute" | "dynamicText" | "custom";

export type ShowRowAsEnum = "none" | "attribute" | "dynamicText" | "custom";

export type ShowEmptyPlaceholderEnum = "none" | "custom";

export type ShowHeaderAsEnum = "attribute" | "dynamicText" | "custom";

export type RenderAsEnum = "grid" | "table";

export interface TableContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    dataSourceCell: ListValue;
    showCellAs: ShowCellAsEnum;
    cellWidgets: ListWidgetValue;
    cellTextTemplate: ListExpressionValue<string>;
    cellAttribute: ListAttributeValue<string>;
    cellClass?: ListExpressionValue<string>;
    referenceRow: ListReferenceValue;
    dataSourceRow: ListValue;
    showRowAs: ShowRowAsEnum;
    rowColumnNameTextTemplate?: DynamicValue<string>;
    rowWidgets: ListWidgetValue;
    rowTextTemplate: ListExpressionValue<string>;
    rowAttribute: ListAttributeValue<string>;
    showEmptyPlaceholder: ShowEmptyPlaceholderEnum;
    emptyPlaceholder: ReactNode;
    rowClass?: ListExpressionValue<string>;
    referenceColumn: ListReferenceValue;
    dataSourceColumn: ListValue;
    showHeaderAs: ShowHeaderAsEnum;
    headerAttribute: ListAttributeValue<string>;
    headerWidgets: ListWidgetValue;
    headerTextTemplate: ListExpressionValue<string>;
    columnClass?: ListExpressionValue<string>;
    onClickRowHeader?: ListActionValue;
    onClickRow?: ListActionValue;
    onClickColumnHeader?: ListActionValue;
    onClickColumn?: ListActionValue;
    onClickCell?: ListActionValue;
    renderAs: RenderAsEnum;
}

export interface TablePreviewProps {
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
    cellClass: string;
    referenceRow: string;
    dataSourceRow: {} | { caption: string } | { type: string } | null;
    showRowAs: ShowRowAsEnum;
    rowColumnNameTextTemplate: string;
    rowWidgets: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    rowTextTemplate: string;
    rowAttribute: string;
    showEmptyPlaceholder: ShowEmptyPlaceholderEnum;
    emptyPlaceholder: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    rowClass: string;
    referenceColumn: string;
    dataSourceColumn: {} | { caption: string } | { type: string } | null;
    showHeaderAs: ShowHeaderAsEnum;
    headerAttribute: string;
    headerWidgets: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    headerTextTemplate: string;
    columnClass: string;
    onClickRowHeader: {} | null;
    onClickRow: {} | null;
    onClickColumnHeader: {} | null;
    onClickColumn: {} | null;
    onClickCell: {} | null;
    renderAs: RenderAsEnum;
}
