/**
 * This file was generated from Table.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ListValue, ListActionValue, ListAttributeValue, ListExpressionValue, ListReferenceValue, ListWidgetValue } from "mendix";

export type ShowCellAsEnum = "attribute" | "dynamicText" | "custom";

export type ShowEmptyPlaceholderEnum = "none" | "custom";

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
    referenceRow: ListReferenceValue;
    objectsDataSourceRow: ListValue;
    showEmptyPlaceholder: ShowEmptyPlaceholderEnum;
    emptyPlaceholder: ReactNode;
    referenceColumn: ListReferenceValue;
    objectsDataSourceColumn: ListValue;
    attributeHeader: ListAttributeValue<string>;
    onClickRow?: ListActionValue;
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
    referenceRow: string;
    objectsDataSourceRow: {} | { caption: string } | { type: string } | null;
    showEmptyPlaceholder: ShowEmptyPlaceholderEnum;
    emptyPlaceholder: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    referenceColumn: string;
    objectsDataSourceColumn: {} | { caption: string } | { type: string } | null;
    attributeHeader: string;
    onClickRow: {} | null;
}
