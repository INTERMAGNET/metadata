/**
 * @module containers/ObservatoriesTable
 * @author Charles Blais, Natural Resources Canada <charles.blais@canada.ca>
 */

import React from 'react';
import { Col } from 'react-bootstrap';

// Contexts
import ObservatoriesTable from '../components/ObservatoriesTable';
// Hooks
import ObservatoriesContext from '../contexts/observatories-context';

const Observatories = () => {
  return (
    <Col sm={12}>
      <ObservatoriesContext.Consumer>
        { observatories => (
          <ObservatoriesTable observatories={(observatories) ? observatories : []} />
        )}
      </ObservatoriesContext.Consumer>
    </Col>
  )
}

export default Observatories;