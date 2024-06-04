import React, { useEffect, useState } from "react";
import Map from "./Map";
import { fetchDataFromSheet } from "./api";

const App = () => {
  const [data, setData] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchDataFromSheet();
      setData(fetchedData);
    };

    loadData();
  }, []);

  const filteredData = filter === 'All' ? data : data.filter(item => item.status === filter);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleClick = (point) => {
    setSelectedPoint(point);
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
          <select value={filter} onChange={handleFilterChange}>
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="WIP">Work in Progress</option>
          </select>
        </div>
        <Map data={filteredData} onMarkerClick={handleClick} selectedPoint={selectedPoint} />
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
