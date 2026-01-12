import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
  type CellContext,
} from '@tanstack/react-table';
import styles from '../styles/ToolsTable.module.css';

export interface ScoreCategory {
  name: string;
  score: number;
  max_score: number;
  status: string;
  summary: string;
  details: string;
}

export interface ScoresData {
  categories: ScoreCategory[];
  average_score: number;
  total_categories: number;
  assessment_date: string;
}

const columnHelper = createColumnHelper<ScoreCategory>();

const renderColumnCell = (label: string, info: CellContext<ScoreCategory, any>) => {
  if (label === 'Status') {
    const value = info.getValue() ?? "-";
    return (
      <span className={`${styles.statusBadge} ${styles[`status-${value}`]}`}>
        {value}
      </span>
    );
  }
  if (label === 'Summary' || label === 'Details') {
    return <div className={styles.description}>{info.getValue() || '-'}</div>;
  }
  return info.getValue() || '-';
};

const ScoresTable: React.FC<{ scoresData: ScoresData | null }> = ({ scoresData }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => renderColumnCell('Name', info),
        size: 200,
      }),
      columnHelper.accessor('score', {
        header: 'Score',
        cell: (info) => renderColumnCell('Score', info),
        size: 80,
      }),
      columnHelper.accessor('max_score', {
        header: 'Max Score',
        cell: (info) => renderColumnCell('Max Score', info),
        size: 100,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => renderColumnCell('Status', info),
        size: 120,
      }),
      columnHelper.accessor('summary', {
        header: 'Summary',
        cell: (info) => renderColumnCell('Summary', info),
        size: 250,
      }),
      columnHelper.accessor('details', {
        header: 'Details',
        cell: (info) => renderColumnCell('Details', info),
        size: 300,
      }),
    ],
    []
  );

  const scoreTable = useReactTable({
    data: scoresData?.categories || [],
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!scoresData || !scoresData.categories || scoresData.categories.length === 0) {
    return null;
  }

  return (
    <div className={styles.tableContainer}>
      <h3 className={styles.tableTitle}>Assessment Scores</h3>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search categories..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.toolsTable}>
          <thead>
            {scoreTable.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={styles.tableHeader}
                    style={{
                      width: header.getSize(),
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className={styles.headerContent}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <span className={styles.sortIndicator}>
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === 'desc' ? ' ▼' : ' ▲'
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {scoreTable.getRowModel().rows.map((row) => (
              <tr key={row.id} className={styles.tableRow}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                    }}
                    className={styles.tableCell}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => scoreTable.previousPage()}
          disabled={!scoreTable.getCanPreviousPage()}
          className={styles.paginationButton}
        >
          Previous
        </button>
        <span className={styles.pageInfo}>
          Page {scoreTable.getState().pagination.pageIndex + 1} of {scoreTable.getPageCount()}
        </span>
        <button
          onClick={() => scoreTable.nextPage()}
          disabled={!scoreTable.getCanNextPage()}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>

      {/* <div className={styles.scoresMetadata}>
        <p>
          <strong>Average Score:</strong> {scoresData.average_score}
        </p>
        <p>
          <strong>Total Categories:</strong> {scoresData.total_categories}
        </p>
        <p>
          <strong>Assessment Date:</strong> {scoresData.assessment_date}
        </p>
      </div> */}
    </div>
  );
};

export default ScoresTable;
