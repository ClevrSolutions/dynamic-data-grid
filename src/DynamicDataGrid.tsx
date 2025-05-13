import { ReactElement, createElement, useCallback, useEffect, useState } from "react";
import classNames from "classnames";

import { Headers } from "./components/Headers";
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
                <div className="widget-datagrid-grid-head" role="rowgroup">
                    <Row key="header" renderAs={renderAs}>
                        {<Headers {...props} />}
                    </Row>
                </div>
            )}
            <div className="widget-datagrid-grid-body table-content" role="rowgroup">
                {rows.map((row, rowIndex) => (
                    <Row className={rowClass?.get(row).value ?? ""} key={row.id} renderAs={renderAs}>
                        <Cells {...props} row={row} rowIndex={rowIndex} loading={loading} />
                    </Row>
                ))}
            </div>
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
