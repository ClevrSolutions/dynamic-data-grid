import { AssociationProperties } from "../widget-plugin-filtering/main";
import { FiltersType } from "typings/DynamicDataGridProps";

export function ensure<T>(arg: T | undefined, msg = "Did not expect an argument to be undefined"): T {
    if (arg == null) {
        throw new Error(msg);
    }

    return arg;
}


export function getAssociationProps(columnProps: FiltersType): AssociationProperties {
    const msg = (propName: string): string =>
        `Can't map ColumnsType to AssociationProperties: ${propName} is undefined`;

    const association = ensure(columnProps.rowFilterAssociation, msg("filterAssociation"));
    const optionsSource = ensure(columnProps.filterAssociationOptions, msg("filterAssociationOptions"));
    const labelSource = ensure(columnProps.filterAssociationOptionLabel, msg("filterAssociationOptionLabel"));

    const props: AssociationProperties = {
        association,
        optionsSource,
        getOptionLabel: item => labelSource.get(item).value ?? "Error: unable to get caption"
    };

    return props;
}

export function getColumnAssociationProps(settings: FiltersType): AssociationProperties | undefined {
    if (!settings.rowFilterAssociation) {
        return;
    }

    return getAssociationProps(settings);
}
