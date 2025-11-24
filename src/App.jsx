/**
 * @module App
 * @author Charles Blais, Natural Resources Canada <charles.blais@canada.ca>
 */

// import the CSS list
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl       from 'leaflet/dist/images/marker-icon.png'
import shadowUrl     from 'leaflet/dist/images/marker-shadow.png'
import React from 'react';
import { Navbar, Nav, Container, Row, Alert } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

// Components
import Loader from './components/Loader';
import DefinitivesTable from './containers/DefinitivesTable';
import InstitutesTable from './containers/InstitutesTable';
import ObservatoriesMap from './containers/ObservatoriesMap';
import ObservatoriesTable from './containers/ObservatoriesTable';
// Contexts
import ContactsContext from './contexts/contacts-context';
import DefinitiveContext from './contexts/definitive-context';
import InstitutesContext from './contexts/institutes-context';
import ObservatoriesContext from './contexts/observatories-context';
// Hooks
import useMetaDataApi from './hooks/useMetaDataApi';
// Utils
import getContacts from './utils/get-contacts'
import getInstDetails from './utils/get-institutes'
import getObsDetails from './utils/get-observatories'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

// get the base URL for the application
const basename =
  (import.meta.env.BASE_URL || '/').replace(/\/+$/, ''); // remove trailing "/"

// hook to manage metadata loading
const useAllMetadata = () => {
  const [definitiveState] = useMetaDataApi('https://wdcapi.bgs.ac.uk/metadata/intermagnet-definitive-catalogue');
  const [observatoryState] = useMetaDataApi('https://wdcapi.bgs.ac.uk/metadata/observatory-metadata?intermagnet=true&historical_instruments=false');
  
  // Combine loading states
  const isLoading = definitiveState.isLoading || observatoryState.isLoading;
  const hasError = definitiveState.isError || observatoryState.isError;
  const allDataLoaded = definitiveState.data && observatoryState.data && !isLoading && !hasError;
  
  // Process data when both API calls have completed successfully
  const processedData = allDataLoaded
  ? {
      definitive: definitiveState.data,
      institutes: getInstDetails(observatoryState),
      observatories: getObsDetails(observatoryState),
      contacts: getContacts(observatoryState)
    }
  : null;
  
  return {
    isLoading,
    hasError,
    allDataLoaded,
    processedData,
    definitiveState,
    observatoryState
  };
};

const App = () => {

  // get loading/error state using hook
  const {
    isLoading,
    hasError,
    allDataLoaded,
    processedData,
    definitiveState,
    observatoryState
  } = useAllMetadata();

  // Error handling if API is down
  if (hasError) {
    return (
      <BrowserRouter basename={basename}>
        <Navbar bg="primary" variant="dark" expand="lg">
          <Navbar.Brand href="https://intermagnet.org/">INTERMAGNET</Navbar.Brand>
        </Navbar>
        <Container className="mt-4">
          <Alert variant="danger">
            <Alert.Heading>Error Loading Data</Alert.Heading>
            <p>
              Failed to fetch data. Please try refreshing the page.
            </p>
            <p>
              Metadata access: <a href="https://wdcapi.bgs.ac.uk/docs" target="_blank" rel="noopener noreferrer">https://wdcapi.bgs.ac.uk/docs</a>
            </p>
            <hr />
            <div className="mb-0">
              <ul className="list-disc ml-4">
                {definitiveState.isError && <li>Definitive data catalogue failed to load</li>}
                {observatoryState.isError && <li>Observatory metadata and contacts failed to load</li>}
              </ul>
            </div>
          </Alert>
        </Container>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter basename={basename}>
      {/* Show loading indicator while data is being fetched */}
      {/* Using WDC API we have 2 loading states, not 4, but visually we can keep all 4*/}
      {isLoading && (
        <Loader
          definitiveState={definitiveState}
          intermagnetState={observatoryState}
        />
      )}

      <Navbar bg="primary" variant="dark" expand="lg">
        <Navbar.Brand href="https://intermagnet.org/">INTERMAGNET</Navbar.Brand>
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

      {/* Only render main content when all data is loaded */}
      {allDataLoaded && processedData && (
        <Container fluid className='main-content'>
          <Row>
            <ObservatoriesContext.Provider value={processedData.observatories}>
              <InstitutesContext.Provider value={processedData.institutes}>
                <ContactsContext.Provider value={processedData.contacts}>
                  <DefinitiveContext.Provider value={processedData.definitive}>
                    <Routes>
                      <Route path="/" element={<ObservatoriesTable />} />
                      <Route path="/map" element={<ObservatoriesMap />} />
                      <Route path="/imos" element={<ObservatoriesTable />} />
                      <Route path="/institutes" element={<InstitutesTable />} />
                      <Route path="/definitives" element={<DefinitivesTable />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </DefinitiveContext.Provider>
                </ContactsContext.Provider>
              </InstitutesContext.Provider>
            </ObservatoriesContext.Provider>
          </Row>
        </Container>
      )}
    </BrowserRouter>
  );
};

export default App;