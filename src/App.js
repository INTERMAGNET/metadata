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

const App = () => {
  const [ contactsState ] = useMetaDataApi('https://geomag.bgs.ac.uk/im_mdata/imag_reports/contacts/?format=json');
  const [ definitiveState ] = useMetaDataApi('https://geomag.bgs.ac.uk/im_mdata/imag_reports/definitive/?format=json');
  const [ institutesState ] = useMetaDataApi('https://geomag.bgs.ac.uk/im_mdata/imag_reports/institutes/?format=json');
  const [ intermagnetState ] = useMetaDataApi('https://geomag.bgs.ac.uk/im_mdata/imag_reports/intermagnet/?format=json');

  return (
    <HashRouter basename="/">
      <Loader
        contactsState={contactsState}
        definitiveState={definitiveState}
        institutesState={institutesState}
        intermagnetState={intermagnetState}
      />

      <Navbar bg="primary" variant="dark" expand="lg">
        <Navbar.Brand href="https://intermagnet.github.io/">INTERMAGNET</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/map">Map of Observatories</Nav.Link>
            <Nav.Link as={Link} to="/imos">List of Observatories</Nav.Link>
            <Nav.Link as={Link} to="/institutes">List of Institutes</Nav.Link>
            <Nav.Link as={Link} to="/definitives">Definitive Data Catologue</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid className='main-content'>
        <Row>
          <ObservatoriesContext.Provider value={intermagnetState.data} >
              <InstitutesContext.Provider value={institutesState.data} >
                <ContactsContext.Provider value={contactsState.data} >
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
    </HashRouter>
  );
};

export default App;
