import React from 'react';
import MapImage from '../MapImage/MapImage';

import './Atm.css';
// export default class Atm extends Component {
//   render() {
//     return (
//       <div className="column atm-card">
//         <h3></h3>
//       </div>
//     );
//   }
// }

export const Atm = ({ atm }) => (
  <div className="column atm-card">
    <div className="map">
      <MapImage
        latitude={atm.geometry.location.lat()}
        longitude={atm.geometry.location.lng()}
      />
    </div>
    <div className="info">
      <h3>{atm.name}</h3>
      <div className="row info-details">
        <h4>{atm.distance}m</h4>
        <h4>{atm.vicinity}</h4>
      </div>
    </div>
  </div>
);
