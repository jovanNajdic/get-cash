import React, { Component } from 'react';
import './MapImage.css';

export default class MapImage extends Component {
  render() {
    const { latitude, longitude } = this.props;
    return (
      <img
        src={`https://maps.googleapis.com/maps/api/staticmap?center=${
          latitude
        },${longitude}&zoom=15&size=300x150&markers=size:mid%7color:red%7C${
          latitude
        },${longitude}`}
        alt={`${latitude}, ${longitude}`}
      />
    );
  }
}
