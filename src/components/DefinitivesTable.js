/**
 * @module components/DefinitivesTable
 * @author Charles Blais, Natural Resource Canada <charles.blais@canada.ca>
 *
 * Station Table
 * ==============
 */

// General modules
import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { Button } from 'react-bootstrap';

import 'react-table/react-table.css';

import ObservatoryModal from './modals/ObservatoryModal';


// create initial state for filter reducer
const filterInitial = {
  year: '',
  republish: '',
  iaga: ''
};

// filter reducer
const filterReducer = (state, action) => {
  switch (action.type) {
    case 'setYear':
      return {...state, year: action.payload};
    case 'setRepublish':
      return {...state, republish: action.payload};
    case 'setIAGA':
      return {...state, iaga: action.payload};
    case 'saveFilter':
      // save the filter returned by react-table into the structure
      const newState = Object.assign({}, filterInitial);
      action.payload.forEach((filter) => newState[filter.id] = filter.value);
      return newState;
    default:
      throw new Error();
  }
};

// create initial state for modal reducer
const modalInitial = {
  show: false,
  iaga: '',
}

// modal reducer
const modalReducer = (state, action) => {
  switch (action.type) {
    case 'setShow':
      return {...state, show: action.payload};
    case 'setIAGA':
      return {...state, iaga: action.payload};
    case 'setModal':
      return action.payload;
    default:
      throw new Error();
  }
};

/**
 * React - Defintives table
 * @param {Object} props - see PropTypes 
 */
const DefinitivesTable = (props) => {
  const {
    definitives,
    setSelectedObservatories,
  } = props;


  // reducer state for modal
  const [ modalState, modalDispatch ] = useReducer(modalReducer, modalInitial);
  // reducer state for filters
  const [ filterState, filterDispatch ] = useReducer(filterReducer, filterInitial);

  const defs = (definitives) ? definitives : [];
  const data = [];
  
  defs["intermagnet_catalogue"].forEach( definitive => {
    const year = definitive.id;
    definitive.observatories.forEach( obs => {
      data.push({
        year: year,
        iaga: obs.iaga_code,
        republish: ('republish' in obs) ? obs.republish : '',
      });
    });
  })

  // sort the data by year
  data.sort((a, b) => {
    if (a.year > b.year) {
      return -1;
    } else if (a.iaga < b.iaga) {
      return 1;
    }
    return 0;
  })

  // Get the list of years with observatory per each
  const years = {};
  data.forEach(row => {
    if( row.year in years ) {
      years[row.year].push(row.iaga);
    } else {
      years[row.year] = [];
    }
  })

  // action on table
  const handleButtonClick = (row) => {
    modalDispatch({
      type: 'setModal',
      payload: {
        show: true,
        iaga: row.original.iaga,
      }
    })
  }

  const columns = [{
    Header: 'Year',
    accessor: 'year',
    Filter: ({ filter, onChange }) => (
      <select
        onChange={event => {
          onChange(event.target.value);
          setSelectedObservatories((event.target.value in years) ? years[event.target.value] : []);
        }}
        style={{ width: "100%" }}
        value={ filterState.year }
      >
        <option value=''>All</option>
        { Object.keys(years).reverse().map((year) => (
           <option key={year} value={year}>{year}</option>
        ))}
      </select>
    ),
    Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
  }, {
    Header: 'Republish',
    accessor: 'republish',
    Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
  }, {
    Header: 'IAGA code',
    accessor: 'iaga',
    filterMethod: (filter, row) => row[filter.id] ? row[filter.id].toLowerCase().includes(filter.value.toLowerCase()) : true,
    Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
  }, {
    Header: 'Details',
    accessor: 'properties.id',
    filterable: false,
    Cell: row => (<Button onClick={() => handleButtonClick(row)}>view</Button>),
  }];

  return (
    <React.Fragment>
      <ReactTable
        data={data}
        className="-striped -highlight"
        columns={columns}
        filterable
        sortable
        resizable
        filtered={[{
          id: 'year',
          value: filterState.year,
        },{
          id: 'republish',
          value: filterState.republish,
        },{
          id: 'iaga',
          value: filterState.iaga,
        }]}
        onFilteredChange={(filtered) => {
          // save the state in case of rerender
          filterDispatch({type: 'saveFilter', payload: filtered});
        }}
        defaultPageSize={10}
      />
      <ObservatoryModal
        show={modalState.show}
        onHide={() => modalDispatch({ type: 'setShow', payload: false })}
        iaga={modalState.iaga} />
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
  setSelectedObservatories: (values) => {console.log(values)},
}

export default DefinitivesTable;