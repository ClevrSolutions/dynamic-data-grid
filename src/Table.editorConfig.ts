import { TablePreviewProps } from "../typings/TableProps";
import { hidePropertiesIn } from "@mendix/pluggable-widgets-tools";

export type Platform = "web" | "desktop";

export type Properties = PropertyGroup[];

type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[]; // used for customizing object grids
    objects?: ObjectProperties[];
    properties?: Properties[];
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[]; // used for customizing object grids
};

export type Problem = {
    property?: string; // key of the property, at which the problem exists
    severity?: "error" | "warning" | "deprecation"; // default = "error"
    message: string; // description of the problem
    studioMessage?: string; // studio-specific message, defaults to message
    url?: string; // link with more information about the problem
    studioUrl?: string; // studio-specific link
};

type BaseProps = {
    type: "Image" | "Container" | "RowLayout" | "Text" | "DropZone" | "Selectable" | "Datasource";
    grow?: number; // optionally sets a growth factor if used in a layout (default = 1)
};

type ImageProps = BaseProps & {
    type: "Image";
    document?: string; // svg image
    data?: string; // base64 image
    property?: object; // widget image property object from Values API
    width?: number; // sets a fixed maximum width
    height?: number; // sets a fixed maximum height
};

type ContainerProps = BaseProps & {
    type: "Container" | "RowLayout";
    children: PreviewProps[]; // any other preview element
    borders?: boolean; // sets borders around the layout to visually group its children
    borderRadius?: number; // integer. Can be used to create rounded borders
    backgroundColor?: string; // HTML color, formatted #RRGGBB
    borderWidth?: number; // sets the border width
    padding?: number; // integer. adds padding around the container
};

type RowLayoutProps = ContainerProps & {
    type: "RowLayout";
    columnSize?: "fixed" | "grow"; // default is fixed
};

type TextProps = BaseProps & {
    type: "Text";
    content: string; // text that should be shown
    fontSize?: number; // sets the font size
    fontColor?: string; // HTML color, formatted #RRGGBB
    bold?: boolean;
    italic?: boolean;
};

type DropZoneProps = BaseProps & {
    type: "DropZone";
    property: object; // widgets property object from Values API
    placeholder: string; // text to be shown inside the dropzone when empty
    showDataSourceHeader?: boolean; // true by default. Toggles whether to show a header containing information about the datasource
};

type SelectableProps = BaseProps & {
    type: "Selectable";
    object: object; // object property instance from the Value API
    child: PreviewProps; // any type of preview property to visualize the object instance
};

type DatasourceProps = BaseProps & {
    type: "Datasource";
    property: object | null; // datasource property object from Values API
    child?: PreviewProps; // any type of preview property component (optional)
};

export type PreviewProps =
    | ImageProps
    | ContainerProps
    | RowLayoutProps
    | TextProps
    | DropZoneProps
    | SelectableProps
    | DatasourceProps;

export function getProperties(
    values: TablePreviewProps,
    defaultProperties: Properties /* , target: Platform*/
): Properties {
    // Do the values manipulation here to control the visibility of properties in Studio and Studio Pro conditionally.
    /* Example
    if (values.myProperty === "custom") {
        delete defaultProperties.properties.myOtherProperty;
    }
    */
    if (values.showCellAs === "attribute") {
        hidePropertiesIn(defaultProperties, values, ["cellWidgets"]);
        hidePropertiesIn(defaultProperties, values, ["cellTextTemplate"]);
    }
    if (values.showCellAs === "custom") {
        hidePropertiesIn(defaultProperties, values, ["cellAttribute"]);
        hidePropertiesIn(defaultProperties, values, ["cellTextTemplate"]);
    }
    if (values.showCellAs === "dynamicText") {
        hidePropertiesIn(defaultProperties, values, ["cellWidgets"]);
        hidePropertiesIn(defaultProperties, values, ["cellAttribute"]);
    }
    if (values.showEmptyPlaceholder === "none") {
        hidePropertiesIn(defaultProperties, values, ["emptyPlaceholder"]);
    }
    if (values.showHeaderAs === "none") {
        hidePropertiesIn(defaultProperties, values, ["headerWidgets"]);
        hidePropertiesIn(defaultProperties, values, ["headerTextTemplate"]);
        hidePropertiesIn(defaultProperties, values, ["headerAttribute"]);
        hidePropertiesIn(defaultProperties, values, ["rowColumnNameTextTemplate"]);
        hidePropertiesIn(defaultProperties, values, ["onClickColumnHeader"]);
    }
    if (values.showHeaderAs === "attribute") {
        hidePropertiesIn(defaultProperties, values, ["headerWidgets"]);
        hidePropertiesIn(defaultProperties, values, ["headerTextTemplate"]);
    }
    if (values.showHeaderAs === "custom") {
        hidePropertiesIn(defaultProperties, values, ["headerTextTemplate"]);
        hidePropertiesIn(defaultProperties, values, ["headerAttribute"]);
    }
    if (values.showHeaderAs === "dynamicText") {
        hidePropertiesIn(defaultProperties, values, ["headerWidgets"]);
        hidePropertiesIn(defaultProperties, values, ["headerAttribute"]);
    }
    if (values.showRowAs === "none") {
        hidePropertiesIn(defaultProperties, values, ["rowWidgets"]);
        hidePropertiesIn(defaultProperties, values, ["rowTextTemplate"]);
        hidePropertiesIn(defaultProperties, values, ["rowAttribute"]);
        hidePropertiesIn(defaultProperties, values, ["rowColumnNameTextTemplate"]);
        hidePropertiesIn(defaultProperties, values, ["onClickRowHeader"]);
    }
    if (values.showRowAs === "attribute") {
        hidePropertiesIn(defaultProperties, values, ["rowWidgets"]);
        hidePropertiesIn(defaultProperties, values, ["rowTextTemplate"]);
    }
    if (values.showRowAs === "custom") {
        hidePropertiesIn(defaultProperties, values, ["rowTextTemplate"]);
        hidePropertiesIn(defaultProperties, values, ["rowAttribute"]);
    }
    if (values.showRowAs === "dynamicText") {
        hidePropertiesIn(defaultProperties, values, ["rowWidgets"]);
        hidePropertiesIn(defaultProperties, values, ["rowAttribute"]);
    }
    if (values.onClickColumn !== null || values.onClickRow !== null) {
        hidePropertiesIn(defaultProperties, values, ["onClickCell"]);
    }
    return defaultProperties;
}

// export function check(_values: TablePreviewProps): Problem[] {
//     const errors: Problem[] = [];
//     // Add errors to the above array to throw errors in Studio and Studio Pro.
//     /* Example
//     if (values.myProperty !== "custom") {
//         errors.push({
//             property: `myProperty`,
//             message: `The value of 'myProperty' is different of 'custom'.`,
//             url: "https://github.com/myrepo/mywidget"
//         });
//     }
//     */
//     return errors;
// }

// export function getPreview(values: TablePreviewProps, isDarkMode: boolean, version: number[]): PreviewProps {
//     // Customize your pluggable widget appearance for Studio Pro.
//     return {
//         type: "Container",
//         children: []
//     }
// }

// export function getCustomCaption(values: TablePreviewProps, platform: Platform): string {
//     return "Table";
// }
