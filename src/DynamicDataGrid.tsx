import { ReactElement, createElement } from "react";
import classNames from "classnames";

import { TableFrame } from "./components/TableFrame";
import { Head } from "./components/Head";
import { Body } from "./components/Body";
import { Headers } from "./components/Headers";
import { Row } from "./components/Row";
import { Cells } from "./components/Cells";
import { Pagination } from "./components/Pagination";
import { EmptyPlaceholder } from "./components/EmptyPlaceholder";
import { useGridDataSource } from "./hooks/useGridDataSource";

import { DynamicDataGridContainerProps } from "../typings/DynamicDataGridProps";

export default function DynamicDataGrid(props: DynamicDataGridContainerProps): ReactElement {
    const { style, showRowAs, rowClass, renderAs, showHeaderAs } = props;
    const { dataSourceColumn, pageSize, paging, pagingPosition } = props;

    const { rows, loading, currentPage, setPage, paginationSource } = useGridDataSource(props);

    let columnCount = dataSourceColumn.items?.length || 0;
    if (showRowAs !== "none") {
        columnCount += 1;
    }

    const pagination =
        paging !== "none" ? (
            <Pagination
                canNextPage={paginationSource.hasMoreItems ?? false}
                canPreviousPage={currentPage !== 0}
                gotoPage={(page: number) => setPage(() => page)}
                nextPage={() => setPage(prev => prev + 1)}
                numberOfItems={paginationSource.totalCount}
                page={currentPage}
                pageSize={pageSize}
                previousPage={() => setPage(prev => prev - 1)}
            />
        ) : null;

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
                <Head renderAs={renderAs}>
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
                </Head>
            )}

            <Body renderAs={renderAs}>
                {rows.map((row, rowIndex) => {
                    if (showHeaderAs === "firstRow" && rowIndex === 0) {
                        return null;
                    }

                    return (
                        <Row className={rowClass?.get(row).value ?? ""} key={row.id ?? "loader"} renderAs={renderAs}>
                            <Cells {...props} row={row} rowIndex={rowIndex} loading={loading} />
                        </Row>
                    );
                })}
            </Body>

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
