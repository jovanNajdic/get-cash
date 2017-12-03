import React from 'react';
import { Atm } from '../Atm/Atm';
import './AtmList.css';

export const AtmList = ({ atmList, sort }) => (
  <div className="row atm-list">
    {sort
      ? atmList
          .sort((a, b) => b.distance - a.distance)
          .map(atm => <Atm key={atm.id} atm={atm} />)
      : atmList
          .sort((a, b) => a.distance - b.distance)
          .map(atm => <Atm key={atm.id} atm={atm} />)}
  </div>
);
