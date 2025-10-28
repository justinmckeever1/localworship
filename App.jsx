import React, { useState } from "react";
import data from "./data";
import "./styles.css";

function App() {
  const [search, setSearch] = useState("");

  const filteredData = data.filter((place) =>
    place.name.toLowerCase().includes(search.toLowerCase()) ||
    place.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <h1>LocalWorship Dublin</h1>

      <input
        type="text"
        placeholder="Search by name or area..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      <div className="card-grid">
        {filteredData.length > 0 ? (
          filteredData.map((place) => (
            <div key={place.name} className="card">
              <h3>{place.name}</h3>
              <p>{place.area}</p>
              <a href={place.mapLink} target="_blank" rel="noopener noreferrer">
                View on Google Maps
              </a>
            </div>
          ))
        ) : (
          <p className="no-results">No matching results found.</p>
        )}
      </div>
    </div>
  );
}

export default App;

