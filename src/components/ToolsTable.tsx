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
import { useColumnConfig } from '../context/useColumnConfig';

export interface Tool {
  name: string;
  manufacturer?: string;
  version?: string;
  tebStatus?: string;
  capability?: string;
  subCapability?: string;
  description?: string;
  standardCategory?: string;
  eaReferenceId?: string;
  capabilityManager?: string;
  metaTags?: string;
  standardsComments?: string;
  eaNotes?: string;
  [key: string]: any;
}

const columnHelper = createColumnHelper<Tool>();

const renderColumnCell = (label: string, info: CellContext<Tool, any>) => {
  if (label === 'Meta Tags') {
    return <div className={styles.metaTags}>{info.getValue() || '-'}</div>;
  }
  if (label === 'Standards Comments' || label === 'EA Notes' || label === 'Description') {
    return <div className={styles.description}>{info.getValue() || '-'}</div>;
  }
  return info.getValue() || '-';
};

const ToolsTable: React.FC<{ tools: Tool[] }> = ({ tools }) => {
  const { columns } = useColumnConfig();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const tableColumns = useMemo(
    () =>
      columns
        .filter((column) => column.enabled)
        .map((column) =>
          columnHelper.accessor(column.id as string, {
            header: column.label,
            cell: (info) => renderColumnCell(column.label, info),
            size: 150, // Default size, can be customized
          })
        ),
    [columns]
  );

  const table = useReactTable({
    data: tools,
    columns: tableColumns,
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

  if (tools.length === 0) return null;

  return (
    <div className={styles.tableContainer}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search tools..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.toolsTable}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
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
            {table.getRowModel().rows.map((row) => (
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
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={styles.paginationButton}
        >
          Previous
        </button>
        <span className={styles.pageInfo}>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ToolsTable;

