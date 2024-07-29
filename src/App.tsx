import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Map from "./Map";
import { fetchDataFromSheet } from "./api";
import "./styles.css"; // Ensure styles are imported

const App = () => {
  const [data, setData] = useState([]); // Holds all the fetched data
  const [filter, setFilter] = useState('All'); // Manages the current filter status

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchDataFromSheet();
      setData(fetchedData); // Set the fetched data to state
    };

    loadData();
  }, []);

  // Filter data to only include completed or work in progress sites
  const validData = data.filter(site => site.status === 'Completed' || site.status === 'WIP');

  // Calculate statistics
  const totalSites = validData.length;
  const totalArea = validData.reduce((sum, site) => sum + (site.area || 0), 0);
  const totalTrees = validData.reduce((sum, site) => sum + (site.numsaplings || 0), 0);

  // Filter data based on the selected filter status
  const filteredData = filter === 'All' ? data : data.filter(item => item.status === filter);

  // Handle changing of the filter
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Helmet>
        <title>Million Miyawaki Foundation</title>
      </Helmet>
      <div className="statistics-section">
        <div className="stat-box">
          <label>Total Sites</label>
          <p>{totalSites}</p>
        </div>
        <div className="stat-box">
          <label>Area Planted</label>
          <p>{totalArea}</p>
        </div>
        <div className="stat-box">
          <label>Trees Planted</label>
          <p>{totalTrees}</p>
        </div>
      </div>
      <div style={{ flex: 1, position: "relative" }}>
        <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1000 }}>
          <select onChange={handleFilterChange} id="filter-select">
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="WIP">Work in Progress</option>
            <option value="Approved">Qualified</option>
          </select>
        </div>
        <Map data={filteredData} />
      </div>
    </div>
  );
};

export default App;
