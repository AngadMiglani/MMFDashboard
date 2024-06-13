import React, { useEffect, useState } from "react";
import Map from "./Map.js";
import { fetchDataFromSheet } from "./api.ts";

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

  // Filter data based on the selected filter status
  const filteredData = filter === 'All' ? data : data.filter(item => item.status === filter);

  // Handle changing of the filter
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1000 }}>
          <select onChange={handleFilterChange} id="filter-select">
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="WIP">Work in Progress</option>
          </select>
        </div>
        <Map data={filteredData} />
      </div>
    </div>
  );
};

export default App;
