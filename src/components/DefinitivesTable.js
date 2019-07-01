/**
 * @module components/DefinitivesTable
 * @author Charles Blais, Natural Resource Canada <charles.blais@canada.ca>
 *
 * Station Table
 * ==============
 */

// General modules
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { Button } from 'react-bootstrap';

import 'react-table/react-table.css';

import ObservatoryModal from './modals/ObservatoryModal';


const DefinitivesTable = (props) => {
  const {
    definitives,
    setSelectedObservatories,
  } = props;

  const [ show, showModal ] = useState(false);
  const [ iaga, setIAGA ] = useState('');
  const [ yearFilter, setYearFilter ] = useState('');

  const defs = (definitives) ? definitives : [];
  const data = [];
  
  defs.forEach( definitive => {
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
    setIAGA(row.original.iaga);
    showModal(true);
  }

  const columns = [{
    Header: 'Year',
    accessor: 'year',
    Filter: ({ filter, onChange }) => (
      <select
        onChange={event => {
          onChange(event.target.value);
          setYearFilter(event.target.value);
          setSelectedObservatories((event.target.value in years) ? years[event.target.value] : []);
        }}
        style={{ width: "100%" }}
        value={ yearFilter }
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
          value: yearFilter,
        }]}
        defaultPageSize={10}
      />
      <ObservatoryModal
        show={show}
        onHide={() => showModal(false)}
        iaga={iaga} />
    </React.Fragment>
  );
};

DefinitivesTable.propTypes = {
  definitives: PropTypes.arrayOf(PropTypes.object),
  setSelectedObservatories: PropTypes.func,
};

DefinitivesTable.defaultProps = {
  setSelectedObservatories: (values) => {console.log(values)},
}

export default DefinitivesTable;