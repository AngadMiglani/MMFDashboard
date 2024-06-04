import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";

const Map = ({ data, onMarkerClick, selectedPoint }) => {
  const [viewport, setViewport] = useState({
    latitude: 28.53,
    longitude: 77.22,
    zoom: 9,
    width: "100vw", // Ensuring the map fills the available width.
    height: "100vh" // Ensuring the map fills the available height.
  });

  const markerImages = {
    Completed: "/free-map-marker-icon-green.png",
    WIP: "/free-map-marker-icon-orange.png",
    default: "/free-map-marker-icon-green.png",
  };

  const getMarkerImage = (status) => {
    return markerImages[status] || markerImages.default;
  };

  const handleMarkerClick = (e, point) => {
    e.preventDefault(); // Prevent default action (e.g., form submission if any).
    e.stopPropagation(); // Stop the event from bubbling up to higher level elements.
    onMarkerClick(point);
  };

  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapboxApiAccessToken="pk.eyJ1IjoibmlraGlsc2FyYWYiLCJhIjoiY2xlc296YjRjMDA5dDNzcXphZjlzamFmeSJ9.7ZDaMZKecY3-70p9pX9-GQn" // Replace with your actual Mapbox access token
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
              width: "40px", // Fixed width
              height: "40px", // Fixed height
              transform: selectedPoint && selectedPoint.id === point.id ? 'scale(1.6)' : 'none',
              transition: 'transform 0.3s ease-out'
            }}
            onClick={(e) => handleMarkerClick(e, point)}
          >
            <img
              src={getMarkerImage(point.status)}
              alt="Marker"
              style={{ width: "100%", height: "100%" }}
            />
          </button>
        </Marker>
      ))}
    </ReactMapGL>
  );
};

export default Map;
