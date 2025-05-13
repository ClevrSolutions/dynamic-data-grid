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
    const { style, showRowAs, rowClass, renderAs, showHeaderAs } = props;
    const { dataSourceCell, dataSourceColumn, pageSize, pageCell, paging, pagingPosition, dataSourceRow } = props;

    const rows = dataSourceRow.items ?? [];
    const currentPage = paging === "row" ? dataSourceRow.offset / pageSize : dataSourceColumn.offset / pageSize;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (dataSourceCell.status === "available" && dataSourceCell.limit !== 0) {
            setLoading(false);
        }
    }, [dataSourceCell]);

    useEffect(() => {
        if (paging === "row") {
            dataSourceRow.requestTotalCount(true);
            if (dataSourceRow.limit === Number.POSITIVE_INFINITY) {
                dataSourceRow.setLimit(pageSize);
            }
        }
        if (paging === "column") {
            dataSourceColumn.requestTotalCount(true);
            if (dataSourceColumn.limit === Number.POSITIVE_INFINITY) {
                dataSourceColumn.setLimit(pageSize);
            }
        }
    }, [dataSourceRow, dataSourceColumn, pageSize, paging]);

    useEffect(() => {
        const length = paging === "row" ? dataSourceColumn.items?.length ?? 0 : dataSourceRow.items?.length ?? 0;
        const limit = pageSize * length;
        if (pageCell && dataSourceCell.limit !== limit) {
            dataSourceCell.setLimit(limit);
        }
    }, [dataSourceCell, dataSourceColumn, pageSize, pageCell, paging, dataSourceRow]);

    const setPage = useCallback(
        (computePage: (prevPage: number) => number) => {
            const newPage = computePage(currentPage);
            if (paging === "row") {
                dataSourceRow.setOffset(newPage * pageSize);
            }
            if (paging === "column") {
                dataSourceColumn.setOffset(newPage * pageSize);
            }
            if (pageCell) {
                const columnCount = dataSourceColumn.items?.length ?? 0;
                dataSourceCell.setOffset(newPage * pageSize * columnCount);
                setLoading(true);
            }
        },
        [currentPage, dataSourceRow, paging, pageSize, dataSourceColumn, dataSourceCell, pageCell]
    );

    let columnCount = dataSourceColumn.items?.length || 0;
    if (showRowAs !== "none") {
        columnCount += 1;
    }
    const pagination =
        paging === "row" ? (
            <Pagination
                canNextPage={dataSourceRow.hasMoreItems ?? false}
                canPreviousPage={currentPage !== 0}
                gotoPage={(page: number) => setPage && setPage(() => page)}
                nextPage={() => setPage && setPage(prev => prev + 1)}
                numberOfItems={dataSourceRow.totalCount}
                page={currentPage}
                pageSize={pageSize}
                previousPage={() => setPage && setPage(prev => prev - 1)}
            />
        ) : (
            <Pagination
                canNextPage={dataSourceColumn.hasMoreItems ?? false}
                canPreviousPage={currentPage !== 0}
                gotoPage={(page: number) => setPage && setPage(() => page)}
                nextPage={() => setPage && setPage(prev => prev + 1)}
                numberOfItems={dataSourceColumn.totalCount}
                page={currentPage}
                pageSize={pageSize}
                previousPage={() => setPage && setPage(prev => prev - 1)}
            />
        );

    return (
        <TableFrame
            columnCount={columnCount}
            className={classNames(props.class, `mx-name-${props.name}`)}
            style={style}
            renderAs={renderAs}
            paging={paging !== "none"}
            pagination={pagination}
            pagingPosition={pagingPosition}
        >
            {showHeaderAs !== "none" && (
                <div className="widget-datagrid-grid-head" role="rowgroup">
                    {showHeaderAs !== "firstRow" && (
                        <Row key="header" renderAs={renderAs}>
                            <Headers {...props} />
                        </Row>
                    )}
                    {showHeaderAs === "firstRow" && rows[0] && (
                        <Row key="header" renderAs={renderAs}>
                            <Cells {...props} row={rows[0]} rowIndex={0} loading={loading} isHeader />
                        </Row>
                    )}
                </div>
            )}
            <div className="widget-datagrid-grid-body table-content" role="rowgroup">
                {rows.map((row, rowIndex) => {
                    if (showHeaderAs === "firstRow" && rowIndex === 0) {
                        return null;
                    }
                    return (
                        <Row className={rowClass?.get(row).value ?? ""} key={row.id} renderAs={renderAs}>
                            <Cells {...props} row={row} rowIndex={rowIndex} loading={loading} />
                        </Row>
                    );
                })}
            </div>
            {rows.length === 0 && (
                <EmptyPlaceholder
                    showEmptyPlaceholder={props.showEmptyPlaceholder}
                    columnCount={columnCount}
                    emptyPlaceholder={props.emptyPlaceholder}
                    renderAs={renderAs}
                />
            )}
        </TableFrame>
    );
}
