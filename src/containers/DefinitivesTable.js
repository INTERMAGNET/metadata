/**
 * @module containers/Definitives
 * @author Charles Blais, Natural Resources Canada <charles.blais@canada.ca>
 */

import React, { useState } from 'react';

import { Col } from 'react-bootstrap';

import DefinitiveContext from '../contexts/definitive-context';
import DefinitivesTable from '../components/DefinitivesTable';

import ObservatoryMap from '../components/maps/ObservatoriesMap';

const Definitives = () => {

  const [ observatories, setSelectedObservatories ] = useState([]);

  return (
    <DefinitiveContext.Consumer>
      { definitives => (
        <React.Fragment>
          <Col sm={4}>
            <DefinitivesTable
              definitives={definitives}
              setSelectedObservatories={setSelectedObservatories}  
            />
          </Col>
          <Col sm={8}>
            <ObservatoryMap observatories={observatories} />
          </Col>
        </React.Fragment>
      )}
    </DefinitiveContext.Consumer>
  )
}

export default Definitives;