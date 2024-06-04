import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";

const Map = ({ data, onMarkerClick, selectedPoint }) => {
  const [viewport, setViewport] = useState({
    latitude: 28.53,
    longitude: 77.22,
    zoom: 9
  });

  // Ensure your access token is correct and active
  const mapboxToken = "pk.eyJ1IjoibmlraGlsc2FyYWYiLCJhIjoiY2xlc296YjRjMDA5dDNzcXphZjlzamFmeSJ9.7ZDaMZKecY3-70p9pX9-GQ";

  return (
    <ReactMapGL
      {...viewport}
      width="100%"  // Make sure this is 100%
      height="100%"  // Make sure this is 100%
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapboxApiAccessToken={mapboxToken}  // Correct property for passing token
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      {data.map((point) => (
        <Marker
          key={point.id}
          latitude={point.latitude}
          longitude={point.longitude}
        >
          <button
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              transform: selectedPoint && selectedPoint.id === point.id ? 'scale(1.6)' : 'none',
              transition: 'transform 0.3s ease-out'
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMarkerClick(point);
            }}
          >
            <img
              src={getMarkerImage(point.status)}
              alt="Marker"
              style={{ width: "32px", height: "32px" }}
            />
          </button>
        </Marker>
      ))}
    </ReactMapGL>
  );
};

export default Map;
