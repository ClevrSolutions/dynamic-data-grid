import { ReactElement, createElement, useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { FilterCondition } from "mendix/filters";
import { and } from "mendix/filters/builders";
import { FilterType, FilterFunction, useFilterContext, useMultipleFiltering } from "./widget-plugin-filtering/main";
import { extractFilters } from "./features/filters";
import { getColumnAssociationProps } from "./features/column";

import { Headers, FilterRenderer } from "./components/Headers";
import { Row } from "./components/Row";
import { TableFrame } from "./components/TableFrame";
import { EmptyPlaceholder } from "./components/EmptyPlaceholder";
import { Cells } from "./components/Cells";
import { Pagination } from "./components/Pagination";

import { DynamicDataGridContainerProps } from "../typings/DynamicDataGridProps";

import "./ui/DynamicDataGrid.css";

export default function DynamicDataGrid(props: DynamicDataGridContainerProps): ReactElement {
    const { style, dataSourceColumn, dataSourceRow, showRowAs, rowClass, renderAs, showHeaderAs } = props;
    const rows = dataSourceRow.items ?? [];
    const currentPage =
        props.paging === "row"
            ? props.dataSourceRow.offset / props.pageSize
            : props.dataSourceColumn.offset / props.pageSize;
    const [loading, setLoading] = useState(true);
    const viewStateFilters = useRef<FilterCondition | undefined>(undefined);
    const [filtered, setFiltered] = useState(false);
    const multipleFilteringState = useMultipleFiltering();
    const { FilterContext } = useFilterContext();

    useEffect(() => {
        if (props.dataSourceCell.status === "available" && props.dataSourceCell.limit !== 0) {
            setLoading(false);
        }
    }, [props.dataSourceCell]);

    useEffect(() => {
        if (props.paging === "row") {
            props.dataSourceRow.requestTotalCount(true);
            if (props.dataSourceRow.limit === Number.POSITIVE_INFINITY) {
                props.dataSourceRow.setLimit(props.pageSize);
            }
        }
        if (props.paging === "column") {
            props.dataSourceColumn.requestTotalCount(true);
            if (props.dataSourceColumn.limit === Number.POSITIVE_INFINITY) {
                props.dataSourceColumn.setLimit(props.pageSize);
            }
        }
    }, [props.dataSourceRow, props.dataSourceColumn, props.pageSize, props.paging]);

    useEffect(() => {
        if (props.dataSourceRow.filter && !filtered && !viewStateFilters.current) {
            viewStateFilters.current = props.dataSourceRow.filter;
        }
    }, [props.dataSourceRow, filtered]);

    // TODO: Rewrite this logic with single useReducer (or write
    // custom hook that will use useReducer)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const customFiltersState = props.filters.map(() => useState<FilterFunction>());

    const filters = customFiltersState
        .map(([customFilter]) => customFilter?.getFilterCondition?.())
        .filter((filter): filter is FilterCondition => filter !== undefined)
        .concat(
            // Concatenating multiple filter state
            Object.keys(multipleFilteringState)
                .map((key: FilterType) => multipleFilteringState[key][0]?.getFilterCondition())
                .filter((filter): filter is FilterCondition => filter !== undefined)
        );

    if (filters.length > 0) {
        props.dataSourceRow.setFilter(filters.length > 1 ? and(...filters) : filters[0]);
    } else if (filtered) {
        props.dataSourceRow.setFilter(undefined);
    } else {
        props.dataSourceRow.setFilter(viewStateFilters.current);
    }

    useEffect(() => {
        const length =
            props.paging === "row" ? props.dataSourceColumn.items?.length ?? 0 : props.dataSourceRow.items?.length ?? 0;
        const limit = props.pageSize * length;
        if (props.pageCell && props.dataSourceCell.limit !== limit) {
            props.dataSourceCell.setLimit(limit);
        }
    }, [
        props.dataSourceCell,
        props.dataSourceColumn,
        props.pageSize,
        props.pageCell,
        props.paging,
        props.dataSourceRow
    ]);

    const setPage = useCallback(
        (computePage: (prevPage: number) => number) => {
            const newPage = computePage(currentPage);
            if (props.paging === "row") {
                props.dataSourceRow.setOffset(newPage * props.pageSize);
            }
            if (props.paging === "column") {
                props.dataSourceColumn.setOffset(newPage * props.pageSize);
            }
            if (props.pageCell) {
                const columnCount = props.dataSourceColumn.items?.length ?? 0;
                props.dataSourceCell.setOffset(newPage * props.pageSize * columnCount);
                setLoading(true);
            }
        },
        [
            currentPage,
            props.dataSourceRow,
            props.paging,
            props.pageSize,
            props.dataSourceColumn,
            props.dataSourceCell,
            props.pageCell
        ]
    );

    let columnCount = dataSourceColumn.items?.length || 0;
    if (showRowAs !== "none") {
        columnCount += 1;
    }
    const pagination =
        props.paging === "row" ? (
            <Pagination
                canNextPage={props.dataSourceRow.hasMoreItems ?? false}
                canPreviousPage={currentPage !== 0}
                gotoPage={(page: number) => setPage && setPage(() => page)}
                nextPage={() => setPage && setPage(prev => prev + 1)}
                numberOfItems={props.dataSourceRow.totalCount}
                page={currentPage}
                pageSize={props.pageSize}
                previousPage={() => setPage && setPage(prev => prev - 1)}
            />
        ) : (
            <Pagination
                canNextPage={props.dataSourceColumn.hasMoreItems ?? false}
                canPreviousPage={currentPage !== 0}
                gotoPage={(page: number) => setPage && setPage(() => page)}
                nextPage={() => setPage && setPage(prev => prev + 1)}
                numberOfItems={props.dataSourceColumn.totalCount}
                page={currentPage}
                pageSize={props.pageSize}
                previousPage={() => setPage && setPage(prev => prev - 1)}
            />
        );

    const filterRenderer: FilterRenderer = useCallback(
        (renderWrapper, filterIndex) => {
            const column = props.filters[filterIndex];
            const { rowAttribute, filter } = column;
            const associationProps = getColumnAssociationProps(column);
            const [, filterDispatcher] = customFiltersState[filterIndex];
            const initialFilters = extractFilters(rowAttribute, viewStateFilters.current);

            if (!rowAttribute && !associationProps) {
                return renderWrapper(filter);
            }

            return renderWrapper(
                <FilterContext.Provider
                    value={{
                        filterDispatcher: prev => {
                            setFiltered(true);
                            filterDispatcher(prev);
                            return prev;
                        },
                        singleAttribute: rowAttribute,
                        singleInitialFilter: initialFilters,
                        associationProperties: associationProps
                    }}
                >
                    {filter}
                </FilterContext.Provider>
            );
        },
        [FilterContext, customFiltersState, props.filters]
    );

    return (
        <TableFrame
            columnCount={columnCount}
            className={classNames(props.class, `mx-name-${props.name}`)}
            style={style}
            renderAs={renderAs}
            paging={props.paging !== "none"}
            pagination={pagination}
            pagingPosition={props.pagingPosition}
        >
            {showHeaderAs !== "none" && (
                <Row key="header" renderAs={renderAs}>
                    {<Headers {...props} filterRenderer={filterRenderer} />}
                </Row>
            )}
            {rows.map((row, rowIndex) => (
                <Row className={rowClass?.get(row).value ?? ""} key={row.id} renderAs={renderAs}>
                    <Cells {...props} row={row} rowIndex={rowIndex} loading={loading} />
                </Row>
            ))}
            {rows.length === 0 && (
                <EmptyPlaceholder
                    showEmptyPlaceholder={props.showEmptyPlaceholder}
                    columnCount={columnCount}
                    emptyPlaceholder={props.emptyPlaceholder}
                    renderAs={props.renderAs}
                />
            )}
        </TableFrame>
    );
}
