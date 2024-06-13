
import React, { useEffect, useState } from "react";
import Map from "./Map.js";
import { fetchDataFromSheet } from "./api.ts";

const App = () => {
  const [data, setData] = useState([]); // Holds all the fetched data
  const [selectedPoint, setSelectedPoint] = useState(null); // Holds the currently selected marker data
  const [filter, setFilter] = useState('All'); // Manages the current filter status

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchDataFromSheet();
      setData(fetchedData); // Set the fetched data to state
    };

    loadData();
  }, []);

  // Filter data based on the selected filter status
  const filteredData = filter === 'All' ? data : data.filter(item => item.status === filter);

  // Handle changing of the filter
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const converttodegree = (value) => {
    const absDecimal = Math.abs(value);
    const degrees = Math.floor(absDecimal);
    const minutesDecimal = (absDecimal - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = Math.floor((minutesDecimal - minutes) * 60);
    return `${degrees}° ${minutes}' ${seconds}"`;
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "50%", height: "100%" }}>
        <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1000 }}>
          <select onChange={handleFilterChange}>
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="WIP">Work in Progress</option>
          </select>
        </div>
        <Map data={filteredData} onMarkerClick={setSelectedPoint} />
      </div>
      <div style={{ width: "50%", padding: 20 }}>
        {selectedPoint ? (
          <div>
            <h2>{selectedPoint.name}</h2>
            <p>Latitude: {converttodegree(selectedPoint.latitude)}</p>
            <p>Longitude: {converttodegree(selectedPoint.longitude)}</p>
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
