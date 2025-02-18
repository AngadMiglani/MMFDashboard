import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Map from "./Map";
import { fetchDataFromSheet } from "./api";
import "./styles.css"; // Ensure styles are imported

const App = () => {
  const [data, setData] = useState([]); // Holds all the fetched data
  const [filter, setFilter] = useState('All'); // Manages the current filter status
  const [searchTerm, setSearchTerm] = useState(''); // Manages the search term

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchDataFromSheet();
      setData(fetchedData); // Set the fetched data to state
    };

    loadData();
  }, []);

  // Filter data based on the dropdown status and search term
  const validData = data.filter((site) => {
    const matchesFilter = filter === 'All' || site.status === filter;
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate statistics
  const totalSites = validData.length;
  const totalArea = validData.reduce((sum, site) => sum + (site.area || 0), 0);
  const totalTrees = validData.reduce((sum, site) => sum + (site.numsaplings || 0), 0);

  // Handle changing of the filter
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Handle changing of the search term
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to convert number with commas
  function formatNumberWithCommas(number) {
    return number.toLocaleString();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Helmet>
        <title>MillionMiyawaki Dashboard</title>
      </Helmet>
      <div className="statistics-section">
        <div className="stat-box">
          <label>Sites</label>
          <p>{formatNumberWithCommas(totalSites)}</p>
        </div>
        <div className="stat-box">
          <label>Area</label>
          <p>{formatNumberWithCommas(totalArea)} sq.ft.</p>
        </div>
        <div className="stat-box">
          <label>Trees</label>
          <p>{formatNumberWithCommas(totalTrees)}</p>
        </div>
      </div>
      <div style={{ flex: 1, position: "relative" }}>
        {/* Dropdown on the left */}
        <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1000 }}>
          <select onChange={handleFilterChange} id="filter-select">
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="WIP">WIP</option>
            <option value="Qualified">Qualified</option>
            <option value="Allocated">Allocated</option>
            <option value="Not Qualified">Not Qualified</option>
          </select>
        </div>

        {/* Search box in the center */}
        <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}>
          <input
            type="text"
            placeholder="Search by site name"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              width: "300px",
              textAlign: "center",
            }}
          />
        </div>

        <Map data={validData} />
      </div>
    </div>
  );
};

export default App;
