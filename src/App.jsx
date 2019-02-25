/**
 * @module App
 * @author Charles Blais, Natural Resource Canada <charles.blais@canada.ca>
 */


import React from 'react';

// Redux modules
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { logger } from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

// CSS modules
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import './index.css';

// User contributed modules
import reducer from './reducers';
import ContainerApp from './containers/App';

// Create store
const store = createStore(
  reducer,
  applyMiddleware(promise, thunk, logger),
);

const App = () => (
  <Provider store={store}>
    <ContainerApp />
  </Provider>
);

export default App;
