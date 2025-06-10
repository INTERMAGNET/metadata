/**
 * @module App
 * @author Charles Blais, Natural Resources Canada <charles.blais@canada.ca>
 */

// import the CSS list
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-table/react-table.css';
import 'leaflet/dist/leaflet.css';

import React from 'react';
import { HashRouter, Route, Link } from "react-router-dom";
import { Navbar, Nav, Container, Row } from 'react-bootstrap';

// Hooks
import useMetaDataApi from './hooks/useMetaDataApi';

// Components
import Loader from './components/Loader';
import ObservatoriesMap from './containers/ObservatoriesMap';
import ObservatoriesTable from './containers/ObservatoriesTable';
import DefinitivesTable from './containers/DefinitivesTable';
import InstitutesTable from './containers/InstitutesTable';

// Contexts
import ObservatoriesContext from './contexts/observatories-context';
import InstitutesContext from './contexts/institutes-context';
import ContactsContext from './contexts/contacts-context';
import DefinitiveContext from './contexts/definitive-context';

// Utils
import getContacts from './utils/get-contacts'
import getInstDetails from './utils/get-institutes'
import getObsDetails from './utils/get-observatories'

const App = () => {
  const [ definitiveState ] = useMetaDataApi('https://wdcapi.bgs.ac.uk/metadata/intermagnet-definitive-catalogue');
  const [ allMetadataState ] = useMetaDataApi('https://wdcapi.bgs.ac.uk/metadata/observatory-metadata');
  
  // Check if all data has loaded successfully
  const isAllDataLoaded = !definitiveState.isLoading &&
                          !allMetadataState.isLoading &&
                          !definitiveState.isError &&
                          !allMetadataState.isError &&
                          definitiveState.data &&
                          allMetadataState.data;

  // Only process data if it's loaded
  const observatoryInstitutes = isAllDataLoaded ? getInstDetails(allMetadataState) : [];
  const observatoryDetails = isAllDataLoaded ? getObsDetails(allMetadataState) : [];
  const observatoryContacts = isAllDataLoaded ? getContacts(allMetadataState) : [];

  return (
    <HashRouter basename="/">
      <Loader
        contactsState={allMetadataState}
        definitiveState={definitiveState}
        institutesState={allMetadataState}
        intermagnetState={allMetadataState}
      />

      <Navbar bg="primary" variant="dark" expand="lg">
        <Navbar.Brand href="https://intermagnet.github.io/">INTERMAGNET</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/map">Map of Observatories</Nav.Link>
            <Nav.Link as={Link} to="/imos">List of Observatories</Nav.Link>
            <Nav.Link as={Link} to="/institutes">List of Institutes</Nav.Link>
            <Nav.Link as={Link} to="/definitives">Definitive Data Catalogue</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {isAllDataLoaded && (
        <Container fluid className='main-content'>
          <Row>
            <ObservatoriesContext.Provider value={observatoryDetails}>
              <InstitutesContext.Provider value={observatoryInstitutes}>
                <ContactsContext.Provider value={observatoryContacts}>
                  <DefinitiveContext.Provider value={definitiveState.data}>
                    <Route exact path="/" component={ObservatoriesTable} />
                    <Route path="/map" component={ObservatoriesMap} />
                    <Route path="/imos" component={ObservatoriesTable} />
                    <Route path="/institutes" component={InstitutesTable} />
                    <Route path="/definitives" component={DefinitivesTable} />
                  </DefinitiveContext.Provider>
                </ContactsContext.Provider>
              </InstitutesContext.Provider>
            </ObservatoriesContext.Provider>
          </Row>
        </Container>
      )}
    </HashRouter>
  );
};

export default App;