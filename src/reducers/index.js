/**
 * @module reducer
 * @author Charles Blais, Natural Resource Canada <charles.blais@canada.ca>
 *
 * Reducer
 * =======
 * Redux reducer that contains a modal object and an object for all form
 * fields.
 *
 * Redux store structure:
 *  - intermagnet = GeoJSON object of INTERMAGNET stations with metdata
 *      behind the scene, the intermagnet URL is converted to GeoJSON and contacts,
 *      institues, and definitive is added as properties.  For details on the INTERMAGNET
 *      structure, see the actions module.
 *  - statusModal
 *      - show = display the status modal
 *      - content = text on the status modal
 */


// General modules
import { combineReducers } from 'redux';

// User contributed modules
import * as types from '../constants/actionTypes';

// Initial state
const initialState = {
  intermagnet: {
    stations: {
      features: [],
    },
    contacts: [],
    institutes: [],
    definitive: [],
  },
  map: {
    center: [0, 0],
    zoom: 2,
  },
  query: {
    isFetching: false,
    error: null,
  },
};

/**
 * Reducer associated with intermagnet object
 *
 * @param {Object} [state=initialState.intermagnet] - state
 * @param {Object} action - redux action
 * @return updated state
 */
const intermagnetReducer = (state = initialState.intermagnet, action) => {
  switch (action.type) {
    case types.SET_STATIONS:
      return { ...state, stations: action.payload };
    case types.SET_CONTACTS:
      return { ...state, contacts: action.payload };
    case types.SET_DEFINITIVE:
      return { ...state, definitive: action.payload };
    case types.SET_INSTITUTES:
      return { ...state, institues: action.payload };
    case types.SELECT_STATIONS: {
      let { features } = state.stations;
      features = features.map((station) => {
        const { properties } = station;
        properties.selected = action.payload.includes(properties.id);
        return { ...station, properties };
      });
      return { ...state, stations: { type: 'FeatureCollection', features } };
    }
    case types.HIGHLIGHT_STATIONS: {
      let { features } = state.stations;
      features = features.map((station) => {
        const { properties } = station;
        properties.highlighted = action.payload.includes(properties.id);
        return { ...station, properties };
      });
      return { ...state, stations: { type: 'FeatureCollection', features } };
    }
    default: {
      return state;
    }
  }
};


/**
 * Reducer associated with fetching map object
 *
 * @param {Object} [state=initialState.map] - map store
 * @param {Object} action - redux action
 * @return new state
 */
const mapReducer = (state = initialState.map, action) => {
  switch (action.type) {
    case types.SET_MAP_CENTER:
      return { ...state, center: action.payload };
    case types.SET_MAP_ZOOM:
      return { ...state, zoom: action.payload };
    default:
      return state;
  }
};


/**
 * Reducer associated with fetching status object
 *
 * @param {Object} [state=initialState.query] - query store
 * @param {Object} action - redux action
 * @return new state
 */
const queryReducer = (state = initialState.query, action) => {
  switch (action.type) {
    case types.FETCH_METADATA_PENDING:
      return { ...state, isFetching: true, error: null };
    case types.FETCH_METADATA_FULFILLED:
      return { ...state, isFetching: false };
    case types.FETCH_METADATA_REJECTED:
      return { ...state, isFetching: false, error: action.payload };
    default:
      return state;
  }
};


// Combine reducers
const rootReducer = combineReducers({
  intermagnet: intermagnetReducer,
  map: mapReducer,
  query: queryReducer,
});

export default rootReducer;
