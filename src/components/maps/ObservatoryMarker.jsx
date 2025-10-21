/**
 * @module components/ObservatoriesMap/ObservatoryMarker
 * @author Charles Blais, Natural Resource Canada <charles.blais@canada.ca>
 */

// General modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { CircleMarker } from 'react-leaflet';

import ObservatoryModal from '../modals/ObservatoryModal';

/**
 * React - Observatory Marker on leaflet map
 * @param {Object} props - see PropTypes 
 */
const ObservatoryMarker = (props) => {
  const {
    latitude,
    longitude,
    status,
    iaga,
  } = props;

  const [ show, showModal ] = useState(false);
  const lon = (longitude > 180) ? longitude - 360.0 : longitude;


  return (
    <>
      <CircleMarker
        center={[latitude, lon]}
        eventHandlers={{ click: () => showModal(true) }}
        // In v4, use pathOptions for dynamic style updates
        pathOptions={{ color: status === 'imo' ? 'red' : 'grey' }}
      />
      {show && (
        <ObservatoryModal
          show
          onHide={() => showModal(false)}
          iaga={iaga}
        />
      )}
    </>
  );
}

/**
 * latitude - latitude coordinate
 * longitude - longitude coordiante
 * status - status of the observatory ('imo' == active)
 * iaga - iaga code for populating details
 */
ObservatoryMarker.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  iaga: PropTypes.string.isRequired,
}

export default ObservatoryMarker;
