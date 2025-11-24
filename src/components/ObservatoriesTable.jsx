
/**
 * @module components/ObservatoriesTable
 * Observatories Table (TanStack Table v8)
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
import { Button } from 'react-bootstrap';

import { COUNTRY_CODES } from '../constants';

import ObservatoryModal from './modals/ObservatoryModal';

const columnHelper = createColumnHelper();

const ObservatoriesTable = (props) => {
  const { observatories } = props;

  const [show, showModal] = useState(false);
  const [iaga, setIAGA] = useState('');

  // ----- data prep -----
  const data = useMemo(() => {
    const list = observatories ? [...observatories] : [];
    list.forEach(obs => {
      obs.country =
        obs.country && COUNTRY_CODES[obs.country]
          ? COUNTRY_CODES[obs.country]
          : obs.country;
    });
    // sort by iaga asc
    list.sort((a, b) => (a.iaga > b.iaga ? 1 : a.iaga < b.iaga ? -1 : 0));
    return list;
  }, [observatories]);

  // lists for the select filters
  const gins = useMemo(() => {
    const set = new Set();
    data.forEach(o => { if (o.gin) set.add(o.gin); });
    return Array.from(set).sort();
  }, [data]);

  const statusList = useMemo(() => {
    const set = new Set();
    data.forEach(o => { if (o.status) set.add(o.status); });
    return Array.from(set).sort();
  }, [data]);

  const handleButtonClick = (row) => {
    setIAGA(row.original.iaga);
    showModal(true);
  };

  const ciIncludes = (row, columnId, value) => {
    const v = row.getValue(columnId);
    return !value || (v && String(v).toLowerCase().includes(String(value).toLowerCase()));
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('iaga', {
        header: 'IAGA code',
        filterFn: ciIncludes,
        enableSorting: true
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        filterFn: ciIncludes,
        enableSorting: true
      }),
      columnHelper.accessor('country', {
        header: 'Country',
        filterFn: ciIncludes,
        enableSorting: true
      }),
      columnHelper.accessor('latitude', {
        header: 'Latitude',
        cell: info => info.getValue(),
        enableSorting: true
      }),
      columnHelper.accessor('longitude', {
        header: 'Longitude',
        cell: info => info.getValue(),
        enableSorting: true
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        filterFn: (row, id, value) => !value || row.getValue(id) === value,
        enableSorting: true
      }),
      columnHelper.accessor('gin', {
        header: 'GIN',
        filterFn: (row, id, value) => !value || row.getValue(id) === value,
        enableSorting: true
      }),
      columnHelper.display({
        id: 'details',
        header: 'Details',
        cell: ({ row }) => <Button onClick={() => handleButtonClick(row)}>view</Button>,
        enableSorting: false,
        enableColumnFilter: false
      })
    ],
    []
  );

  // ----- table state -----
  const [sorting, setSorting] = useState([{ id: 'iaga', desc: false }]);
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

  // render filter UI per column
  const renderFilter = (column) => {
    if (column.id === 'status') {
      const val = column.getFilterValue() ?? '';
      return (
        <select
          value={val}
          onChange={e => column.setFilterValue(e.target.value)}
          style={{ width: '100%' }}
        >
          <option value="">All</option>
          {statusList.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      );
    }
    if (column.id === 'gin') {
      const val = column.getFilterValue() ?? '';
      return (
        <select
          value={val}
          onChange={e => column.setFilterValue(e.target.value)}
          style={{ width: '100%' }}
        >
          <option value="">All</option>
          {gins.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      );
    }
    // default text filter
    return (
      <input
        value={column.getFilterValue() ?? ''}
        onChange={e => column.setFilterValue(e.target.value)}
        placeholder="Filter…"
        style={{ width: '100%' }}
      />
    );
  };

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
        <Button
          variant="outline-secondary" size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Prev
        </Button>
        <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
        <Button
          variant="outline-secondary" size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Next
        </Button>
        <select
          className="form-select form-select-sm w-auto"
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
        >
          {[10, 20, 50].map(s => <option key={s} value={s}>{s} / page</option>)}
        </select>
      </div>

      <ObservatoryModal
        show={show}
        onHide={() => showModal(false)}
        iaga={iaga}
      />
    </React.Fragment>
  );
};

ObservatoriesTable.propTypes = {
  observatories: PropTypes.arrayOf(PropTypes.object),
};

export default ObservatoriesTable;
