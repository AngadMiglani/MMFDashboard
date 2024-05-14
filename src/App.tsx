import React, { useEffect, useState } from "react";

import Map from "./Map.js";
import { fetchDataFromSheet } from "./api.ts";

const App = () => {
  const [data, setData] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchDataFromSheet();
      setData(fetchedData);
    };

    loadData();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "50%", height: "100%" }}>
        <Map data={data} onMarkerClick={setSelectedPoint} />
      </div>
      <div style={{ width: "50%", padding: 20 }}>
        {selectedPoint ? (
          <div>
            <h2>{selectedPoint.name}</h2>
            <p>Latitude: {selectedPoint.latitude}</p>
            <p>Longitude: {selectedPoint.longitude}</p>
            <p>Date of Plantation: {selectedPoint.plantationdate}</p>
            <p>Area Planted: {selectedPoint.area}</p>
            <p>Saplings Planted: {selectedPoint.numsaplings}</p>
            <p>Status: {selectedPoint.status}</p>
            <iframe src={selectedPoint.image} width="640" height="480" allow="autoplay"></iframe>
            
          </div>
        ) : (
          <p>Click a marker to see details</p>
        )}
      </div>
    </div>
  );
};

export default App;
