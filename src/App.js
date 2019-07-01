import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import './App.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'react-table/react-table.css';
import 'leaflet/dist/leaflet.css';

import { Navbar, Nav, Container, Row } from 'react-bootstrap';

import ObservatoriesContext from './contexts/observatories-context';
import InstitutesContext from './contexts/institutes-context';
import ContactsContext from './contexts/contacts-context';
import DefinitiveContext from './contexts/definitive-context';
import useMetaDataApi from './hooks/useMetaDataApi';

import Loader from './components/Loader';
import ObservatoriesMap from './containers/ObservatoriesMap';
import ObservatoriesTable from './containers/ObservatoriesTable';
import DefinitivesTable from './containers/DefinitivesTable';


const App = () => {
  const [ contactsState ] = useMetaDataApi('https://geomag.bgs.ac.uk/im_mdata/imag_reports/contacts/?format=json');
  const [ definitiveState ] = useMetaDataApi('https://geomag.bgs.ac.uk/im_mdata/imag_reports/definitive/?format=json');
  const [ institutesState ] = useMetaDataApi('https://geomag.bgs.ac.uk/im_mdata/imag_reports/institutes/?format=json');
  const [ intermagnetState ] = useMetaDataApi('https://geomag.bgs.ac.uk/im_mdata/imag_reports/intermagnet/?format=json');

  return (
    <Router>
      <Loader
        contactsState={contactsState}
        definitiveState={definitiveState}
        institutesState={institutesState}
        intermagnetState={intermagnetState}
      />

      <Navbar bg="primary" variant="dark" expand="lg">
        <Navbar.Brand>INTERMAGNET</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <LinkContainer to="/map"><Nav.Link>Map of Observatories</Nav.Link></LinkContainer>
            <LinkContainer to="/list"><Nav.Link>List of Observatories</Nav.Link></LinkContainer>
            <LinkContainer to="/definitives"><Nav.Link>Definitive Data Catologue</Nav.Link></LinkContainer>
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
                    <Route path="/list" component={ObservatoriesTable} />
                    <Route path="/definitives" component={DefinitivesTable} />
                  </DefinitiveContext.Provider>
                </ContactsContext.Provider>
              </InstitutesContext.Provider>
            </ObservatoriesContext.Provider>
          </Row>
      </Container>

    </Router>
  );
};

export default App;
