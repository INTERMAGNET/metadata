/**
 * @module containers/ObservatoriesTable
 * @author Charles Blais, Natural Resources Canada <charles.blais@canada.ca>
 */

import React from 'react';
import { Col } from 'react-bootstrap';

// Hooks
import InstitutesContext from '../contexts/institutes-context';

// Contexts
import InstitutesTable from '../components/InstitutesTable';
import ObservatoriesContext from '../contexts/observatories-context';

const Institutes = () => {
  return (
    <Col sm={12}>
      <ObservatoriesContext>
        { observatories => (
          <InstitutesContext.Consumer>
            { institutes => (
              <InstitutesTable
                institutes={(institutes) ? institutes : []} 
                observatories={(observatories) ? observatories : []} />
            )}
          </InstitutesContext.Consumer>
        )}
      </ObservatoriesContext>
    </Col>
  )
}

export default Institutes;