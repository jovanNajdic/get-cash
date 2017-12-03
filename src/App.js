import React, { Component } from 'react';
import { AtmList } from './Components/AtmList/AtmList';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      pos: {},
      atms: [],
      sortIt: false,
      loadingError: false,
      loading: true
    };
  }

  getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(this.getCoords, this.ifError);
  };

  ifError = err => {
    this.setState({
      loadingError: true,
      loading: false
    });
  };

  getCoords = pos => {
    const { latitude, longitude } = pos.coords;
    this.setState(
      {
        ...this.state,
        loading: false,
        pos: {
          latitude,
          longitude
        }
      },
      this.getAtms
    );
  };

  sortIt = () => {
    this.setState({
      ...this.state,
      sortIt: !this.state.sortIt
    });
  };

  getAtms = () => {
    const google = window.google;
    let map;
    let service;
    let marker;

    const query = {
      location: new google.maps.LatLng(
        this.state.pos.latitude,
        this.state.pos.longitude
      ),
      rankBy: google.maps.places.RankBy.DISTANCE,
      type: ['atm']
    };

    map = new google.maps.Map(this.refs.mapEl, {
      center: new google.maps.LatLng(
        this.state.pos.latitude,
        this.state.pos.longitude
      ),
      zoom: 14
    });

    marker = new google.maps.Marker({
      map,
      position: new google.maps.LatLng(
        this.state.pos.latitude,
        this.state.pos.longitude
      ),
      icon: (new Image().src = './location-marker.png')
    });

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(query, (res, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const atms = res
          .map(atm => {
            const distance = Math.round(
              google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(
                  atm.geometry.location.lat(),
                  atm.geometry.location.lng()
                ),
                new google.maps.LatLng(
                  this.state.pos.latitude,
                  this.state.pos.longitude
                )
              )
            );
            return Object.assign({}, atm, { distance });
          })
          .slice(0, 10);

        this.setState(
          {
            ...this.state,
            atms
          },
          () => {
            this.state.atms.map(atm => {
              let location = atm.geometry.location;
              let marker = new google.maps.Marker({
                map,
                position: location,
                icon: (new Image().src = './marker-location.png')
              });
            });
          }
        );
      }
    });
  };

  componentDidMount() {
    setTimeout(this.getUserLocation, 2000);
  }

  render() {
    const { sortIt, loadingError, loading } = this.state;
    return (
      <div className="container-full">
        <nav className="main-nav">
          <div className="container">
            <div className="row">
              <div className="brand">
                Get<span>Cash</span>
              </div>
            </div>
          </div>
        </nav>
        {loadingError && (
          <div className="error-screen">
            <div className="error-card">
              <img src="/location-marker.png" alt="" />
              <div className="title">
                <h2> Greska ! </h2>
                <h5> Proverite postavke vaseg pretrazivaca </h5>
              </div>
              <div className="error-body">
                <img
                  src="http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons-256/simple-red-glossy-icons-symbols-shapes/020960-simple-red-glossy-icon-symbols-shapes-smileyfacesad.png"
                  alt="sadface"
                />
              </div>
            </div>
          </div>
        )}
        {loading && (
          <div className="error-screen">
            <div className="error-card">
              <img src="/location-marker.png" alt="" />
              <div className="title">
                <h2> Preuzimanje koordinata </h2>
                <h5> Molimo sacekajte ... </h5>
              </div>
              <div className="error-body">
                <img
                  src="https://camo.githubusercontent.com/a1a81b0529517027d364ee8432cf9a8bd309542a/687474703a2f2f692e696d6775722e636f6d2f56446449444f522e676966"
                  alt="loading"
                />
              </div>
            </div>
          </div>
        )}
        {!loading &&
          !loadingError && (
            <div className="container-full">
              <div className="row no-padding">
                <div className="mapEl" ref="mapEl" />
              </div>
              <div className="container">
                <div className="row get-distance">
                  <div className="column">
                    <h4>Izaberi udaljenost</h4>
                    <button onClick={this.sortIt} className="distance-button">
                      {sortIt
                        ? 'Od najudaljenijeg ka najblizem'
                        : 'Od najblizeg ka najudaljenijem'}
                    </button>
                  </div>
                </div>
                <AtmList sort={this.state.sortIt} atmList={this.state.atms} />
              </div>
            </div>
          )}
      </div>
    );
  }
}

export default App;
