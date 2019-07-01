/**
 * @module components/Loader
 * @author Charles Blais, Natural Resource Canada <charles.blais@canada.ca>
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Spinner, Alert } from 'react-bootstrap';

// Constants
const COMPLETED_COUNT = 4;


/**
 * Loader text information
 * @param {object} props 
 */
const LoaderText = (props) => {
  const {
    item,
    isLoading,
    isError,
  } = props;

  if (isError) {
    return (
      <Alert variant='danger'>
        <p>Error downloading {item}</p>
      </Alert>
    );
  }
  else if (isLoading) {
    return (
      <Alert variant='info'>
        <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
        <span>Downloading {item}...</span>
      </Alert>
    );
  }
  return (
    <Alert variant='success'>
      <p>Download {item} complete</p>
    </Alert>
  );
}

LoaderText.propTypes = {
  item: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
}


const Loader = (props) => {
  const {
    contactsState,
    institutesState,
    definitiveState,
    intermagnetState,
  } = props;

  let completed = 0;
  completed += (contactsState.isLoading && !contactsState.isError) ? 0 : 1;
  completed += (institutesState.isLoading && !institutesState.isError) ? 0 : 1;
  completed += (definitiveState.isLoading && !definitiveState.isError) ? 0 : 1;
  completed += (intermagnetState.isLoading && !intermagnetState.isError) ? 0 : 1;

  return (
    <Modal
      show={ completed !== COMPLETED_COUNT}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          INTERMAGNET metadata
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LoaderText item='contacts'
          isLoading={contactsState.isLoading} isError={contactsState.isError} />
        <LoaderText item='list of institutes'
          isLoading={institutesState.isLoading} isError={institutesState.isError} />
        <LoaderText item='definitive information'
          isLoading={definitiveState.isLoading} isError={definitiveState.isError} />
        <LoaderText item='intermanget observatory details'
          isLoading={intermagnetState.isLoading} isError={intermagnetState.isError} />
      </Modal.Body>
    </Modal>
  )
};




const stateObject = {
  isError: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

Loader.propTypes = {
  contactsState: PropTypes.shape(stateObject).isRequired,
  institutesState: PropTypes.shape(stateObject).isRequired,
  definitiveState: PropTypes.shape(stateObject).isRequired,
  intermagnetState: PropTypes.shape(stateObject).isRequired,
};


export default Loader;