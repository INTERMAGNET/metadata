/**
 * @module containers/Observatories
 * @author Charles Blais, Natural Resources Canada <charles.blais@canada.ca>
 */

import React from 'react';

import { Col } from 'react-bootstrap';

import ObservatoriesContext from '../contexts/observatories-context';
import ObservatoriesMap from '../components/maps/ObservatoriesMap';

const Observatories = () => {
  return (
    <Col sm={12}>
      <ObservatoriesContext.Consumer>
        { observatories => {
          const observatoriesIaga = (observatories) ? observatories.map( obs => obs.id ) : [];
          return (
            <ObservatoriesMap observatories={observatoriesIaga} />
          );
        }}
      </ObservatoriesContext.Consumer>
    </Col>
  )
}

export default Observatories;