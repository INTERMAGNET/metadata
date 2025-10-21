/**
 * @module components/ObservatoryMap
 * @author Charles Blais, Natural Resource Canada <charles.blais@canada.ca>
 */

// General modules
import PropTypes from 'prop-types';
import React from 'react';
import { MapContainer, LayersControl, TileLayer } from 'react-leaflet';

import ObservatoriesContext from '../../contexts/observatories-context';

import ObservatoryMarker from './ObservatoryMarker';

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
 * React - Observatory Map
 * @param {Object} props - see PropTypes 
 */
const ObservatoriesMap = (props) => {
  const {
    observatories,
    center,
    zoom,
  } = props;
  
  return (
    <ObservatoriesContext.Consumer>
      { observatoriesStore => {
        const markers = observatories.map(iaga => {
          const observatory = findByKey(observatoriesStore, 'id', iaga);
          if (Object.keys(observatory).length === 0) {
            console.warn(`Could not find ${iaga} for marker`)
            return null;
          }
          return (<ObservatoryMarker
            key={observatory.id}
            latitude={observatory.latitude}
            longitude={observatory.longitude}
            status={observatory.status}
            iaga={observatory.iaga}
          />);
        });
        return (
          <MapContainer center={center} zoom={zoom}>
            <LayersControl position='topright'>
              <LayersControl.BaseLayer name="Streets">
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer checked name="Satellite">
                <TileLayer
                  attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            { markers }
          </MapContainer>
        );
      }}
    </ObservatoriesContext.Consumer>
    
  );
}

/**
 * observatories - list of IAGA codes to plot on map, library will search for details in context
 * center - center of map
 * zoom - zoom level of map
 */
ObservatoriesMap.propTypes = {
  observatories: PropTypes.arrayOf(PropTypes.string).isRequired,
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
};

ObservatoriesMap.defaultProps = {
  center: [0, 0],
  zoom: 2,
}

export default ObservatoriesMap;
