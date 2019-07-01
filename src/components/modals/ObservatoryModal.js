/**
 * @module modals/ObservatoryModal
 * @author Charles Blais, Natural Resources Canada <charles.blais@canada.ca>
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Container, Row, Col, Table, Modal } from 'react-bootstrap';
import { Map, TileLayer, CircleMarker } from 'react-leaflet';

import ObservatoriesContext from '../../contexts/observatories-context';
import InstitutesContext from '../../contexts/institutes-context';
import ContactsContext from '../../contexts/contacts-context';

import { COUNTRY_CODES } from '../../constants';


/**
 * Search the object with the key value pair
 * @param {[Object]} elements - array to search
 * @param {string} key - key to match
 * @param {*} value - value to match
 */
const findByKey = (elements, key, value) => {
  const reducer = (accumulator, currentElement) => {
    return (currentElement[key] === value) ? currentElement : accumulator;
  }
  return elements.reduce(reducer, {});
}


/**
 * React - Observatory Modal
 * @param {Object} props - see PropTypes
 */
const ObservatoryModal = (props) => {
  const {
    show,
    onHide,
    iaga,
  } = props;

  return (
    <ObservatoriesContext.Consumer>
      { observatories => {
        if ( !observatories ) return null; // nopthing to show
        const observatory = findByKey(observatories, 'id', iaga);
        return (
          <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                { observatory.name } ({observatory.iaga})
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ObservatoryModalBody observatory={observatory} />
            </Modal.Body>
          </Modal>
        )
      }}
    </ObservatoriesContext.Consumer>
  );
};


/**
 * show - extend Modal show element of react-bootstrap
 * onHide - extend Modal onHide element of react-bootstrap
 * iaga - iaga code of observatory to show
 */
ObservatoryModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  iaga: PropTypes.string.isRequired,
}

ObservatoryModal.defaultProps = {
  show: true,
  onHide: () => {},
}


/**
 * Observatory Modal Body
 * ======================
 * 
 * We include institutes and contact information that are referenced by ID in the
 * observatory information.
 * 
 * @param {Object} props - no requirement at this stage
 */
const ObservatoryModalBody = (props) => {

  // Create a copy of the observatory by setting some default values
  const observatory = Object.assign({institutes: [], contacts: []}, props.observatory);
  observatory.instruments = (observatory.instruments_ml) ? observatory.instruments_ml[0].lines : [];

  return (
    <InstitutesContext.Consumer>
      { institutes => (
        <ContactsContext.Consumer>
          { contacts => {
            observatory.institutes = observatory.institutes.map( institute => {
              return findByKey(institutes, 'id', institute);
            });
            observatory.contacts = observatory.contacts.map( contact => (contact in contacts) ? contacts[contact] : {} );
            return (
              <Container fluid>
                <Row>
                  <Col sm={12}>
                    <ObservatoryModalTable {...observatory} />
                  </Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <ObservatoryModalMap {...observatory} />
                  </Col>
                </Row>
              </Container>
            )
          }}
        </ContactsContext.Consumer>
      )}
    </InstitutesContext.Consumer>
  )
}


/**
 * React - Observatory Modal Table
 * @param {Object} props - see PropTypes
 */
const ObservatoryModalTable = (props) => {

  const {
    iaga,
    name,
    latitude,
    longitude,
    elevation,
    institutes,
    country,
    instruments,
    contacts,
    status,
    gin,
  } = props;

  // Convert the institute into a list
  const instituteList = institutes.map( (institute) => {
    if ( !Object.values(institute).length ) return null;

    return (
      <li key={institute.id}>{institute.names[0].name} ({institute.names[0].abbr})</li>
    )
  });

  // Convert the contacts into a list
  const contactsList = contacts.map( (contact, idx) => {
    if ( !Object.values(contact).length ) return null;

    const findAddress = (accumulator, currentValue) => {
      return (currentValue.lang === 'en') ? currentValue : accumulator;
    }
    // We also do a copy of the address since we will remove a property
    const address = Object.assign({}, contact.addresses.reduce(findAddress, contact.addresses[0]));
    delete address.lang;

    // We convert the list of emails to links
    let emails = [];
    if (contact.emails) {
      emails = contact.emails.map( (email) => {
        const link = `mailto:${email}`
        return (<li key={email}><a href={link}>{email}</a></li>);
      })
    }
    
    return (
      <tr key={idx}>
        <th>Contact</th>
        <td>
          <dl>
            <dt>Name</dt>
            <dd>{contact.name}</dd>
            <dt>Address</dt>
            <dd>
              {Object.values(address).map((line, idx) => (<div key={idx}>{line}</div>))}
            </dd>
            { emails.length > 0 &&
              <React.Fragment>
                <dt>Email</dt>
                <dd><ul>{emails}</ul></dd>
              </React.Fragment>
            }
            <dt>Telephone</dt>
            <dd>{contact.tel}</dd>
            { 'fax' in contact && 
              <React.Fragment>
                <dt>Fax</dt>
                <dd>{contact.fax}</dd>
              </React.Fragment>
            }
          </dl>
        </td>
      </tr>
    )
  });

  const lonCorrected = (longitude > 180) ? longitude - 360 : longitude;

  return (
    <Table size='sm'>
      <tbody>
        <tr>
          <th>Name</th>
          <td>{name}</td>
        </tr>
        <tr>
          <th>IAGA code</th>
          <td>{iaga}</td>
        </tr>
        <tr>
          <th>Country</th>
          <td>{(country in COUNTRY_CODES) ? COUNTRY_CODES[country] : country}</td>
        </tr>
        <tr>
          <th>Coordinates</th>
          <td>{Math.abs(latitude).toFixed(4)}{(latitude >= 0)?'N':'S'}, {Math.abs(lonCorrected).toFixed(4)}{(lonCorrected >= 0)?'E':'W'}</td>
        </tr>
        <tr>
          <th>Elevation (m)</th>
          <td>{elevation}</td>
        </tr>
        <tr>
          <th>Status</th>
          <td>{status}</td>
        </tr>
        <tr>
          <th><abbr title='Geomagnetic Information Node'>GIN</abbr></th>
          <td>{gin}</td>
        </tr>
        { instituteList.length > 0 && 
          <tr>
            <th>Institute(s)</th>
            <td>
              <ul>
                {instituteList}
              </ul>
            </td>
          </tr>
        }
        { instruments.length > 0 && 
          <tr>
            <th>Instrument(s)</th>
            <td>
              <ul>
                {instruments.map((instrument, idx) => (<li key={idx}>{instrument}</li>))}
              </ul>
            </td>
          </tr>
        }
        { contactsList }
      </tbody>
    </Table>
  );
};


ObservatoryModalTable.propTypes = {
  iaga: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  elevation: PropTypes.number.isRequired,
  institutes: PropTypes.arrayOf(PropTypes.object),
  country: PropTypes.string.isRequired,
  instruments: PropTypes.arrayOf(PropTypes.string),
  contacts: PropTypes.arrayOf(PropTypes.object),
  status: PropTypes.string.isRequired,
  gin: PropTypes.string,
};

ObservatoryModalTable.defaultProps = {
  institutes: [],
  instruments: [],
  contacts: [],
  gin: '',
};


/**
 * Observatory Modal Map
 * =====================
 * 
 * @param {Object} props 
 */
const ObservatoryModalMap = (props) => {
  const {
    latitude,
    longitude,
    status,
  } = props;

  const lonCorrected = (longitude > 180) ? longitude - 360 : longitude;
  const center = [latitude, lonCorrected];
  const zoom = 14;

  return (
    <Map center={center} zoom={zoom}
      style={{height: '400px', width: '100%'}}
      ref={(map) => (map) ? setTimeout(() => map.leafletElement.invalidateSize(true), 100):null}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={[latitude, lonCorrected]}
        color={status === 'imo' ? 'red': 'grey'}
      />
    </Map>
  )
}

ObservatoryModalMap.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
};

export default ObservatoryModal;