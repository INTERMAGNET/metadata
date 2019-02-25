/**
 * @module components/StationTable
 * @author Charles Blais, Natural Resource Canada <charles.blais@canada.ca>
 *
 * Station Table
 * ==============
 */

// General modules
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';

import 'react-table/react-table.css';

import { COUNTRY_CODES } from '../constants';
import * as actions from '../actions';


const StationTable = (props) => {
  const {
    stations,
    setMapCenter,
    selectStations,
    highlightStations,
  } = props;

  const columns = [{
    Header: 'IAGA code',
    id: 'iaga',
    accessor: 'properties.iaga',
    width: 100,
  }, {
    Header: 'Name',
    accessor: 'properties.name',
  }, {
    Header: 'Country',
    accessor: 'properties.country',
    Cell: row => ((row.value in COUNTRY_CODES) ? COUNTRY_CODES[row.value] : row.value),
  }];

  const defaultSorting = [{
    id: 'iaga',
    desc: false,
  }];

  return (
    <ReactTable
      data={stations.features}
      className="-striped -highlight"
      columns={columns}
      filterable
      sorted={defaultSorting}
      getTrProps={(state, rowInfo) => ({
        onClick: () => {
          setMapCenter([
            rowInfo.original.geometry.coordinates[1],
            rowInfo.original.geometry.coordinates[0],
          ]);
          selectStations([rowInfo.original.properties.id]);
        },
        onMouseOver: () => {
          highlightStations([rowInfo.original.properties.id]);
        },
      })}
    />
  );
};

StationTable.propTypes = {
  stations: PropTypes.instanceOf(Object).isRequired,
  setMapCenter: PropTypes.func.isRequired,
  selectStations: PropTypes.func.isRequired,
  highlightStations: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  stations: state.intermagnet.stations,
  institutes: state.intermagnet.institutes,
});

const mapDispatchToProps = dispatch => ({
  setMapCenter: coord => dispatch(actions.setMapCenter(coord)),
  selectStations: stations => dispatch(actions.selectStations(stations)),
  highlightStations: stations => dispatch(actions.highlightStations(stations)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StationTable);
