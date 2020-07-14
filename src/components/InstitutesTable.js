/**
 * @module components/InstitutesTable
 * @author Charles Blais, Natural Resource Canada <charles.blais@canada.ca>
 *
 * Institutes Table
 * ================
 */

// General modules
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';

import { COUNTRY_CODES } from '../constants';

/**
 * Observatory Table
 * =================
 * @param {Object} props - see PropTypes 
 */
const InstitutesTable = (props) => {
  const {
    institutes,
    observatories,
  } = props;

  const data = (institutes) ? institutes : [];
  const obs = (observatories) ? observatories: [];

  // Convert the institutes code to full string
  data.forEach( inst => {
    inst.country = (inst.country in COUNTRY_CODES) ? COUNTRY_CODES[inst.country] : inst.country;
    inst.imos = obs.filter(ob => {
      if('institutes' in ob && ob.status === 'imo') {
        return ob.institutes.includes(inst.id);
      }
      return false;
    }).map(ob => ob.iaga).join(", ");
  });

  // sort the institutes by id code
  data.sort((a, b) => {
    if (a.id > b.id) {
      return 1;
    } else if (a.id < b.id) {
      return -1;
    }
    return 0;
  })

  // Define the column information for the react-table
  const columns = [{
    Header: 'Name',
    accessor: 'names[0].name',
  }, {
    Header: 'Abbr',
    accessor: 'names[0].abbr',
    width: 75,
  }, {
    Header: 'IMOs',
    accessor: 'imos',
  }, {
    Header: 'Link',
    accessor: 'links[0].link',
    width: 100,
    Cell: row => {
      if(row.value)
        return (<a target="_blank" rel="noopener noreferrer" href={row.value}>Website</a>);
      else
        return null;
    }
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
      />
    </React.Fragment>
  );
};

/**
 * institutes - list of institutes object as stored in BGS
 */
InstitutesTable.propTypes = {
  institutes: PropTypes.arrayOf(PropTypes.object),
};

export default InstitutesTable;