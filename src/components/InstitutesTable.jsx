
/**
 * @module components/InstitutesTable
 * Institutes Table (TanStack Table v8)
 */
// TanStack Table v8
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

import { COUNTRY_CODES } from '../constants';

const columnHelper = createColumnHelper();

const InstitutesTable = (props) => {
  const { institutes, observatories } = props;

  // ----- build the display data [{id, names, country, imos, links}] -----
  const data = useMemo(() => {
    const insts = institutes ? [...institutes] : [];
    const obs = observatories ? observatories : [];
    // map of instituteId -> IMOs the institute belongs to (status === 'imo')
    const imoByInstId = new Map();
    obs.forEach(ob => {
      if (ob?.status === 'imo' && Array.isArray(ob.institutes)) {
        ob.institutes.forEach(id => {
          const list = imoByInstId.get(id) || [];
          list.push(ob.iaga);
          imoByInstId.set(id, list);
        });
      }
    });

    const out = insts.map(inst => {
      const countryName =
        inst.country && COUNTRY_CODES[inst.country]
          ? COUNTRY_CODES[inst.country]
          : inst.country;
      const imos = (imoByInstId.get(inst.id) || []).join(', ');
      return { ...inst, country: countryName, imos };
    });

    // sort by id (asc) to match previous behaviour
    out.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    return out;
  }, [institutes, observatories]);

  const columns = useMemo(
    () => [
      columnHelper.accessor(row => row.names?.[0]?.name ?? '', {
        id: 'name',
        header: 'Name',
        cell: info => info.getValue(),
        filterFn: (row, id, value) =>
          !value ||
          String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase()),
        enableSorting: true
      }),
      columnHelper.accessor(row => row.names?.[0]?.abbr ?? '', {
        id: 'abbr',
        header: 'Abbr',
        cell: info => info.getValue(),
        filterFn: (row, id, value) =>
          !value ||
          String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase()),
        enableSorting: true
      }),
      columnHelper.accessor('imos', {
        header: 'IMOs',
        cell: info => info.getValue(),
        filterFn: (row, id, value) =>
          !value ||
          String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase()),
        enableSorting: true
      }),
      columnHelper.accessor(row => row.links?.[0]?.link ?? '', {
        id: 'link',
        header: 'Link',
        cell: info => {
          const url = info.getValue();
          return url ? (
            <a target="_blank" rel="noopener noreferrer" href={url}>
              Website
            </a>
          ) : null;
        },
        filterFn: (row, id, value) =>
          !value ||
          String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase()),
        enableSorting: false
      })
    ],
    []
  );

  // ----- table state -----
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const renderFilter = (column) => (
    <input
      value={column.getFilterValue() ?? ''}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder="Filter…"
      style={{ width: '100%' }}
    />
  );

  return (
    <React.Fragment>
      <div className="table-responsive rtv6">
        <table className="rtv6-table table table-sm table-striped table-hover">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th
                    key={h.id}
                    data-sort={h.column.getIsSorted?.() ? (h.column.getIsSorted() === 'desc' ? 'desc' : 'asc') : undefined }
                    aria-sort={h.column.getIsSorted?.() ? (h.column.getIsSorted() === 'desc' ? 'descending' : 'ascending') : 'none' }
                    style={{verticalAlign: 'bottom' }}
                  >
                    <button type="button" className="rtv6-th-button" onClick={h.column.getToggleSortingHandler?.()} disabled={!h.column.getCanSort?.()} >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </button>
                    {h.column.getCanFilter?.() && (<div className="rtv6-filter">{renderFilter(h.column)}</div>)}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(r => (
              <tr key={r.id}>
                {r.getVisibleCells().map(c => (
                  <td key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pager */}
      <div className="d-flex align-items-center gap-2">
        <button className="btn btn-outline-secondary btn-sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}>
          Prev
        </button>
        <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
        <button className="btn btn-outline-secondary btn-sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}>
          Next
        </button>
        <select
          className="form-select form-select-sm w-auto"
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
        >
          {[10, 20, 50].map(s => <option key={s} value={s}>{s} / page</option>)}
        </select>
      </div>
    </React.Fragment>
  );
};

InstitutesTable.propTypes = {
  institutes: PropTypes.arrayOf(PropTypes.object),
  observatories: PropTypes.arrayOf(PropTypes.object)
};

export default InstitutesTable;
