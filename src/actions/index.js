/**
 * @module actions
 * @author Charles Blais, Natural Resource Canada <charles.blais@canada.ca>
 *
 * Redux Actions
 * =============
 */

// Required modules
import axios from 'axios';

import {
  URL_METADATA_CONTACTS,
  URL_METADATA_DEFINITIVE,
  URL_METADATA_INSTITUTES,
  URL_METADATA_INTERMAGNET,
} from '../constants';
import * as types from '../constants/actionTypes';


/**
 * Convert the INTERMAGNET JSON object to GeoJSON for
 * simplicity.  In short, we simply take the latitude and longitde
 * and convert the object to a GeoJSON Point feature
 *
 * @param {Object} intermagnet - intermagnet json object
 * @return {Object} intermagnet geojson object
 */
function convertIntermagnetToGeoSJON(intermagnet) {
  return {
    type: 'FeatureCollection',
    features: intermagnet.map((station) => {
      const longitude = (station.longitude > 180) ? station.longitude - 360.0 : station.longitude;
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            longitude,
            station.latitude,
            station.elevation],
        },
        properties: station,
      };
    }),
  };
}


/**
 * Set map center
 *
 * @param {Array} coord - array with latitude and longitude
 * @return {Object} action for redux
 */
export const setMapCenter = coord => ({ type: types.SET_MAP_CENTER, payload: coord });

/**
 * Set map zoom
 *
 * @param {int} level - zoom level
 * @return {Object} action for redux
 */
export const setMapZoom = level => ({ type: types.SET_MAP_ZOOM, payload: level });


/**
 * Select stations
 *
 * @param {Array} stations - array of select stations by their ID
 * @return {Object} action for redux
 */
export const selectStations = stations => ({ type: types.SELECT_STATIONS, payload: stations });

/**
 * Highlight stations
 *
 * @param {Array} stations - array of select stations by their ID
 * @return {Object} action for redux
 */
export const highlightStations = stations => ({
  type: types.HIGHLIGHT_STATIONS,
  payload: stations,
});


/**
 * Fetch response from metadata system
 *
 * @return {Promise<Array>} intermagnet stations
 */
export const fetchStations = () => dispatch => new Promise((resolve) => {
  dispatch({
    type: types.FETCH_METADATA,
    payload: axios.get(URL_METADATA_INTERMAGNET, { responseType: 'json' }),
  }).then((response) => {
    const intermagnet = convertIntermagnetToGeoSJON(response.value.data);
    dispatch({
      type: types.SET_STATIONS,
      payload: intermagnet,
    });
    resolve(intermagnet);
  });
});


/**
 * Fetch response from metadata system
 *
 * @return {Promise<Array>} contacts
 */
export const fetchContacts = () => dispatch => new Promise((resolve) => {
  dispatch({
    type: types.FETCH_METADATA,
    payload: axios.get(URL_METADATA_CONTACTS, { responseType: 'json' }),
  }).then((response) => {
    dispatch({
      type: types.SET_CONTACTS,
      payload: response.value.data,
    });
    resolve(response.value.data);
  });
});


/**
 * Fetch response from metadata system
 *
 * @return {Promise<Array>} institutes
 */
export const fetchInstitutes = () => dispatch => new Promise((resolve) => {
  dispatch({
    type: types.FETCH_METADATA,
    payload: axios.get(URL_METADATA_INSTITUTES, { responseType: 'json' }),
  }).then((response) => {
    dispatch({
      type: types.SET_INSTITUTES,
      payload: response.value.data,
    });
    resolve(response.value.data);
  });
});


/**
 * Fetch response from metadata system
 *
 * @return {Promise<Array>} definitive
 */
export const fetchDefinitive = () => dispatch => new Promise((resolve) => {
  dispatch({
    type: types.FETCH_METADATA,
    payload: axios.get(URL_METADATA_DEFINITIVE, { responseType: 'json' }),
  }).then((response) => {
    dispatch({
      type: types.SET_DEFINITIVE,
      payload: response.value.data,
    });
    resolve(response.value.data);
  });
});
