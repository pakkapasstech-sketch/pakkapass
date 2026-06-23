import { useMemo, useState } from 'react';
import {
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';

import Pagination from './Pagination';
import EmptyState from '../loaders/EmptyState';
import {
  exportToCSV,
  exportToExcel,
} from '../../utils/exportUtils';

import '../../styles/table.css';

const DataTable = ({
  title,
  columns,
  data = [],
  paginated = true,
  pageSize = 5,
  exportable = true,
  viewAllLink,
  actions = false,
  onView,
  onEdit,
  onDelete,
  isLoading,
}) => {
  const [sortKey, setSortKey] =
    useState(null);

  const [sortDir, setSortDir] =
    useState('asc');

  const [page, setPage] =
    useState(1);

  const filtered =
    useMemo(() => {
      const rows = [...data];

      if (sortKey) {
        const col =
          columns.find(
            (c) =>
              c.key ===
              sortKey
          );

        if (col) {
          rows.sort(
            (a, b) => {
              const av =
                col.accessor
                  ? col.accessor(
                      a
                    )
                  : '';

              const bv =
                col.accessor
                  ? col.accessor(
                      b
                    )
                  : '';

              if (av < bv) {
                return sortDir ===
                  'asc'
                  ? -1
                  : 1;
              }

              if (av > bv) {
                return sortDir ===
                  'asc'
                  ? 1
                  : -1;
              }

              return 0;
            }
          );
        }
      }

      return rows;
    }, [
      data,
      sortKey,
      sortDir,
      columns,
    ]);

  const totalPages =
    paginated
      ? Math.ceil(
          filtered.length /
            pageSize
        )
      : 1;

  const paginatedData =
    paginated
      ? filtered.slice(
          (page - 1) *
            pageSize,
          page * pageSize
        )
      : filtered;

  const handleSort = (
    key
  ) => {
    if (
      sortKey === key
    ) {
      setSortDir(
        (prev) =>
          prev ===
          'asc'
            ? 'desc'
            : 'asc'
      );
    } else {
      setSortKey(key);
      setSortDir(
        'asc'
      );
    }
  };

  const exportCols =
    columns.filter(
      (c) =>
        c.exportable !==
        false
    );

  if (isLoading) {
    return (
      <div className="data-table-container">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700" />

          {Array.from({
            length: 5,
          }).map(
            (_, i) => (
              <div
                key={i}
                className="h-10 rounded bg-gray-200 dark:bg-gray-700"
              />
            )
          )}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <EmptyState
        title={`No ${title}`}
      />
    );
  }

  return (
    <div className="data-table-container">
      {/* Header */}
      <div className="data-table-header">
        <h3 className="data-table-title">
          {title}
        </h3>

        <div className="data-table-toolbar">
          {exportable && (
            <>
              <button
                onClick={() =>
                  exportToCSV(
                    filtered,
                    exportCols,
                    `${title}.csv`
                  )
                }
                className="data-table-export-btn"
              >
                <HiOutlineDownload />
                CSV
              </button>

              <button
                onClick={() =>
                  exportToExcel(
                    filtered,
                    exportCols,
                    `${title}.xls`
                  )
                }
                className="data-table-export-btn"
              >
                <HiOutlineDownload />
                Excel
              </button>
            </>
          )}

          {viewAllLink && (
            <button
              className="data-table-view-all"
              onClick={
                viewAllLink
              }
            >
              View All
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead className="data-table-head">
            <tr className="data-table-head-row">
              {columns.map(
                (col) => (
                  <th
                    key={
                      col.key
                    }
                    onClick={() =>
                      col.sortable &&
                      handleSort(
                        col.key
                      )
                    }
                    className={`data-table-th ${
                      col.sortable
                        ? 'data-table-th-sortable'
                        : ''
                    }`}
                  >
                    {
                      col.header
                    }

                    {sortKey ===
                      col.key &&
                      (sortDir ===
                      'asc'
                        ? ' ↑'
                        : ' ↓')}
                  </th>
                )
              )}

              {actions && (
                <th className="data-table-th">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map(
              (
                row,
                idx
              ) => (
                <tr
                  key={
                    row.id ||
                    idx
                  }
                  className="data-table-row"
                >
                  {columns.map(
                    (
                      col
                    ) => (
                      <td
                        key={
                          col.key
                        }
                        className="data-table-td"
                      >
                        {col.render
                          ? col.render(
                              row
                            )
                          : col.accessor(
                              row
                            )}
                      </td>
                    )
                  )}

                  {actions && (
                    <td className="data-table-action-cell">
                      <div className="data-table-action-group">
                        {onView && (
                          <button
                            onClick={() =>
                              onView(
                                row
                              )
                            }
                            className="data-table-view-btn"
                          >
                            <HiOutlineEye />
                          </button>
                        )}

                        {onEdit && (
                          <button
                            onClick={() =>
                              onEdit(
                                row
                              )
                            }
                            className="data-table-edit-btn"
                          >
                            <HiOutlinePencil />
                          </button>
                        )}

                        {onDelete && (
                          <button
                            onClick={() =>
                              onDelete(
                                row
                              )
                            }
                            className="data-table-delete-btn"
                          >
                            <HiOutlineTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginated && (
        <div className="data-table-pagination">
          <Pagination
            page={page}
            totalPages={
              totalPages
            }
            onPageChange={
              setPage
            }
          />
        </div>
      )}
    </div>
  );
};

export default DataTable;