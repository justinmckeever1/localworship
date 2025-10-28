import React, { useState } from "react";
import data from "./data";
import "./styles.css";

function App() {
  const [search, setSearch] = useState("");

  // Safe filtering logic to avoid blank screen errors
  const filteredData = data.filter((place) => {
    const name = place?.name?.toLowerCase() || "";
    const area = place?.area?.toLowerCase() || "";
    const searchTerm = search.toLowerCase();
    return name.includes(searchTerm) || area.includes(searchTerm);
  });

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
          filteredData.map((place, index) => (
            <div key={index} className="card">
              <h3>{place.name}</h3>
              <p>{place.address}</p>
              <a href={place.mapLink} target="_blank" rel="noopener noreferrer">
                View on Google Maps
              </a>
            </div>
          ))
        ) : (
          <p className="no-results">No results found.</p>
        )}
      </div>
    </div>
  );
}

export default App;

