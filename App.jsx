import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './styles.css';
import data from './data';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 53.3498,
  lng: -6.2603
};

function App() {
  return (
    <div className="app">
      <h1>LocalWorship Dublin</h1>
      <div className="map-container">
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
            {data.map((place, index) => (
              <Marker key={index} position={place.position} />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
      <div className="cards">
        {data.map((place, index) => (
          <div key={index} className="card">
            <h3>{place.name}</h3>
            <p>{place.address}</p>
            <a href={place.link} target="_blank" rel="noreferrer">View on Google Maps</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
