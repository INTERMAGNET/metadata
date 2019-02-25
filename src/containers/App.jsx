/**
 * @module App
 * @author Charles Blais, Natural Resource Canada <charles.blais@canada.ca>
 *
 * Main application
 * ================
 */

// General modules
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

import StationMap from '../components/StationMap';
import StationTable from '../components/StationTable';
import * as actions from '../actions';

class App extends React.Component {
  componentDidMount() {
    const {
      fetchStations,
      fetchInstitutes,
      fetchContacts,
      fetchDefinitive,
    } = this.props;

    fetchStations()
      .then(() => fetchContacts()).then(() => fetchInstitutes()).then(() => fetchDefinitive());
  }

  render() {
    return (
      <Row className="full-height">
        <Col sm={3} className="intermagnet-table">
          <StationTable />
        </Col>
        <Col sm={9} className="intermagnet-map">
          <StationMap />
        </Col>
      </Row>
    );
  }
}


App.propTypes = {
  fetchStations: PropTypes.func.isRequired,
  fetchInstitutes: PropTypes.func.isRequired,
  fetchContacts: PropTypes.func.isRequired,
  fetchDefinitive: PropTypes.func.isRequired,
};


const mapDispatchToProps = dispatch => ({
  fetchStations: () => dispatch(actions.fetchStations()),
  fetchInstitutes: () => dispatch(actions.fetchInstitutes()),
  fetchContacts: () => dispatch(actions.fetchContacts()),
  fetchDefinitive: () => dispatch(actions.fetchDefinitive()),
});

export default connect(null, mapDispatchToProps)(App);
