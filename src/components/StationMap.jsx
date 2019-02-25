/**
 * @module components/StationMap
 * @author Charles Blais, Natural Resource Canada <charles.blais@canada.ca>
 *
 * Main application
 * ================
 */

// General modules
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Map,
  TileLayer,
  CircleMarker,
  Popup,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

class StationMap extends React.Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.popups = {};
  }

  componentWillReceiveProps() {
    const { stations } = this.props;
    stations.features.forEach((station) => {
      if (station.properties.selected && station.properties.id in this.popups) {
        this.popups[station.properties.id].leafletElement.openOn(this.map.leafletElement);
      }
    });
  }

  componentDidUpdate() {
    if (this.map) {
      // eslint-disable-next-line no-underscore-dangle
      setTimeout(() => this.map.leafletElement._onResize(), 300);
    }
  }

  render() {
    const { stations, zoom, center } = this.props;
    const markers = stations.features.map(station => (
      <CircleMarker
        key={station.properties.id}
        center={[station.geometry.coordinates[1], station.geometry.coordinates[0]]}
        color={station.properties.highlighted ? 'red' : 'blue'}
      >
        <Popup ref={(node) => { this.popups[station.properties.id] = node; }}>
          { station.properties.id }
        </Popup>
      </CircleMarker>
    ));
    return (
      <div style={{ height: '100%' }}>
        {stations.features.length && (
        <Map
          ref={(node) => { this.map = node; }}
          center={center}
          zoom={zoom}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          { markers }
        </Map>
        )}
      </div>
    );
  }
}

StationMap.propTypes = {
  stations: PropTypes.instanceOf(Object).isRequired,
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  stations: state.intermagnet.stations,
  center: state.map.center,
  zoom: state.map.zoom,
});

export default connect(mapStateToProps)(StationMap);
