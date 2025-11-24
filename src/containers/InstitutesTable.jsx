/**
 * @module containers/ObservatoriesTable
 * @author Charles Blais, Natural Resources Canada <charles.blais@canada.ca>
 */

import React, { useContext } from 'react';
import { Col } from 'react-bootstrap';

// Components
import InstitutesTable from '../components/InstitutesTable';
// Contexts
import InstitutesContext from '../contexts/institutes-context';
import ObservatoriesContext from '../contexts/observatories-context';

const Institutes = () => {
  const institutes = useContext(InstitutesContext);
  const observatories = useContext(ObservatoriesContext);

  return (
    <Col sm={12}>
      <InstitutesTable
        institutes={institutes || []}
        observatories={observatories || []}
      />
    </Col>
  );
};

export default Institutes;