import { useCallback, useEffect, useState } from "react";

import { DynamicDataGridContainerProps } from "../../typings/DynamicDataGridProps";

export function useGridDataSource(props: DynamicDataGridContainerProps) {
    const { dataSourceCell, dataSourceColumn, dataSourceRow, pageSize, paging, pageCell } = props;

    const rows = dataSourceRow.items ?? [];

    const paginationSource = paging === "row" ? dataSourceRow : dataSourceColumn;
    const otherSource = paging === "row" ? dataSourceColumn : dataSourceRow;

    const currentPage = paginationSource.offset / pageSize;

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (dataSourceCell.status === "available" && dataSourceCell.limit !== 0) {
            setLoading(false);
        }
    }, [dataSourceCell]);

    useEffect(() => {
        if (paging === "none") {
            return;
        }
        paginationSource.requestTotalCount(true);
        if (paginationSource.limit === Number.POSITIVE_INFINITY) {
            paginationSource.setLimit(pageSize);
        }
    }, [paginationSource, pageSize, paging]);

    useEffect(() => {
        const length = otherSource.items?.length ?? 0;

        const limit = pageSize * length;

        if (pageCell && dataSourceCell.limit !== limit) {
            dataSourceCell.setLimit(limit);
        }
    }, [dataSourceCell, otherSource, pageSize, pageCell]);

    const setPage = useCallback(
        (computePage: (prev: number) => number) => {
            const newPage = computePage(currentPage);

            paginationSource.setOffset(newPage * pageSize);

            if (pageCell) {
                const columnCount = dataSourceColumn.items?.length ?? 0;
                dataSourceCell.setOffset(newPage * pageSize * columnCount);
                setLoading(true);
            }
        },
        [currentPage, pageSize, pageCell, paginationSource, dataSourceColumn, dataSourceCell]
    );

    return {
        rows,
        loading,
        currentPage,
        setPage,
        paginationSource
    };
}
