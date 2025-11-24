/**
 * @module components/DefinitivesTable
 * Station Table (TanStack Table v8)
 */
// TanStack Table (v8) imports
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import PropTypes from 'prop-types';
import React, { useMemo, useReducer, useState } from 'react';
import { Button } from 'react-bootstrap';

import ObservatoryModal from './modals/ObservatoryModal';

const columnHelper = createColumnHelper();

// ---------------- Reducers (unchanged) ----------------
const filterInitial = { year: '', republish: '', iaga: '' };
const filterReducer = (state, action) => {
  switch (action.type) {
    case 'setYear':       return { ...state, year: action.payload };
    case 'setRepublish':  return { ...state, republish: action.payload };
    case 'setIAGA':       return { ...state, iaga: action.payload };
    case 'saveFilter': {
      const next = { ...filterInitial };
      action.payload.forEach(f => (next[f.id] = f.value));
      return next;
    }
    default: throw new Error();
  }
};

const modalInitial = { show: false, iaga: '' };
const modalReducer = (state, action) => {
  switch (action.type) {
    case 'setShow':  return { ...state, show: action.payload };
    case 'setIAGA':  return { ...state, iaga: action.payload };
    case 'setModal': return action.payload;
    default: throw new Error();
  }
};

// ---------------- Component ----------------
const DefinitivesTable = (props) => {
  const { definitives, setSelectedObservatories } = props;

  // modal + filter state (kept from your original)
  const [modalState, modalDispatch]   = useReducer(modalReducer,  modalInitial);
  const [filterState, filterDispatch] = useReducer(filterReducer, filterInitial);

  // build flat data array [{year, iaga, republish}]
  const data = useMemo(() => {
    const out = [];
    const catalogue = definitives?.intermagnet_catalogue ?? [];
    catalogue.forEach((definitive) => {
        const year = definitive.id;
        definitive.observatories.forEach(obs => {
          out.push({
            year,
            iaga: obs.iaga_code,
            republish: ('republish' in obs) ? obs.republish : '',
          });
        });
      });
      // sort: by year desc, then iaga asc (close to your original)
      out.sort((a, b) => (a.year > b.year ? -1 : a.year < b.year ? 1 : a.iaga.localeCompare(b.iaga)));
      return out;
  }, [definitives]);

  // map of { year: [iaga codes...] } for setSelectedObservatories
  const years = useMemo(() => {
    const m = {};
    data.forEach(row => {
      if (!m[row.year]) m[row.year] = [];
      m[row.year].push(row.iaga);
    });
    return m;
  }, [data]);

  // modal open action
  const handleButtonClick = (row) => {
    modalDispatch({
      type: 'setModal',
      payload: { show: true, iaga: row.original.iaga },
    });
  };

  const columns = useMemo(() => ([
    columnHelper.accessor('year', {
      header: 'Year',
      cell: info => <div style={{ textAlign: 'center' }}>{info.getValue()}</div>,
      // exact match filter on year
      filterFn: (row, columnId, filterValue) => !filterValue || String(row.getValue(columnId)) === String(filterValue),
      enableSorting: true,
    }),
    columnHelper.accessor('republish', {
      header: 'Republish',
      cell: info => <div style={{ textAlign: 'center' }}>{info.getValue()}</div>,
      // case-insensitive substring filter
      filterFn: (row, columnId, filterValue) => {
        const v = row.getValue(columnId);
        return !filterValue || (v && String(v).toLowerCase().includes(String(filterValue).toLowerCase()));
      },
      enableSorting: true,
    }),
    columnHelper.accessor('iaga', {
      header: 'IAGA code',
      cell: info => <div style={{ textAlign: 'center' }}>{info.getValue()}</div>,
      // case-insensitive substring filter
      filterFn: (row, columnId, filterValue) => {
        const v = row.getValue(columnId);
        return !filterValue || (v && String(v).toLowerCase().includes(String(filterValue).toLowerCase()));
      },
      enableSorting: true,
    }),
    columnHelper.display({
      id: 'details',
      header: 'Details',
      cell: ({ row }) => <Button onClick={() => handleButtonClick(row)}>view</Button>,
      enableSorting: false,
      enableColumnFilter: false,
    }),
  ]), []);

  // table UI state
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [columnFilters, setColumnFilters] = useState([
    { id: 'year',      value: filterState.year || '' },
    { id: 'republish', value: filterState.republish || '' },
    { id: 'iaga',      value: filterState.iaga || '' },
  ]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnFilters) : updater;
      setColumnFilters(next);
      // keep your old reducer in sync
      filterDispatch({ type: 'saveFilter', payload: next });
      // reflect Year filter to selected observatories
      const yf = next.find(f => f.id === 'year');
      const selected = yf?.value && years[yf.value] ? years[yf.value] : [];
      setSelectedObservatories(selected);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  // helpers to render per-column filter UIs under headers
  const renderFilter = (column) => {
    if (column.id === 'year') {
      const value = (column.getFilterValue() ?? '');
      return (
        <select
          value={value}
          onChange={e => column.setFilterValue(e.target.value)}
          style={{ width: '100%' }}
        >
          <option value=''>All</option>
          {Object.keys(years).sort((a, b) => Number(b) - Number(a)).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      );
    }
    if (column.id === 'republish' || column.id === 'iaga') {
      return (
        <input
          value={column.getFilterValue() ?? ''}
          onChange={e => column.setFilterValue(e.target.value)}
          placeholder="Filter…"
          style={{ width: '100%' }}
        />
      );
    }
    return null;
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
          variant="outline-secondary"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
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
        show={modalState.show}
        onHide={() => modalDispatch({ type: 'setShow', payload: false })}
        iaga={modalState.iaga}
      />
    </React.Fragment>
  );
};

DefinitivesTable.propTypes = {
  definitives: PropTypes.shape({
    intermagnet_catalogue: PropTypes.array
  }),
  setSelectedObservatories: PropTypes.func
};

DefinitivesTable.defaultProps = {
  setSelectedObservatories: (values) => { console.log(values); },
};

export default DefinitivesTable;