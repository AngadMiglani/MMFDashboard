import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";

const Map = ({ data, onMarkerClick }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);

  const markerImages = {
    Completed: "/free-map-marker-icon-green.png",
    WIP: "/free-map-marker-icon-orange.png",
    default: "/free-map-marker-icon-green.png",
  };

  const getMarkerImage = (status) => {
    return markerImages[status] || markerImages.default;
  };

  const handleMarkerClick = (point) => {
    setSelectedPoint(point.id);  // Update the selected marker's id
    onMarkerClick(point);  // Trigger additional actions if needed
  };

  return (
    <ReactMapGL
      initialViewState={{
        latitude: 28.53,
        longitude: 77.22,
        zoom: 9,
        width: "100vw",
        height: "100vh"
      }}
      mapboxAccessToken="pk.eyJ1IjoibmlraGlsc2FyYWYiLCJhIjoiY2xlc296YjRjMDA5dDNzcXphZjlzamFmeSJ9.7ZDaMZKecY3-70p9pX9-GQ"
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
              width: "32px",
              height: "32px",
              transform: selectedPoint === point.id ? 'scale(1.6)' : 'none',
              transition: 'transform 0.3s ease-out'
            }}
            onClick={() => handleMarkerClick(point)}
          >
            <img
              src={getMarkerImage(point.status)}
              alt="Marker"
              style={{ width: "100%", height: "100%", objectFit: 'contain' }}
            />
          </button>
        </Marker>
      ))}
    </ReactMapGL>
  );
};

export default Map;
