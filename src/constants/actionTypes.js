/**
 * @module constants/actionTypes
 * @author Charles Blais, Natural Resource Canada <charles.blais@canada.ca>
 *
 * Action types
 * ============
 */

// Fetch from metadata host
export const FETCH_METADATA = 'FETCH_METADATA';
export const FETCH_METADATA_PENDING = `${FETCH_METADATA}_PENDING`;
export const FETCH_METADATA_FULFILLED = `${FETCH_METADATA}_FULFILLED`;
export const FETCH_METADATA_REJECTED = `${FETCH_METADATA}_REJECTED`;

// Actions related to setting from the metadata host
export const SET_STATIONS = 'SET_STATIONS';
export const SET_CONTACTS = 'SET_CONTACTS';
export const SET_DEFINITIVE = 'SET_DEFINITVE';
export const SET_INSTITUTES = 'SET_INSTITUTES';

// Map actions
export const SET_MAP_CENTER = 'SET_MAP_CENTER';
export const SET_MAP_ZOOM = 'SET_MAP_ZOOM';

// Misc
export const SELECT_STATIONS = 'SELECT_STATIONS';
export const HIGHLIGHT_STATIONS = 'HIGHLIGHT_STATIONS';
