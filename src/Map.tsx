import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";

const Map = ({ data, onMarkerClick, selectedPoint }) => {
  const [viewport, setViewport] = useState({
    latitude: 28.53,
    longitude: 77.22,
    zoom: 9
  });

  const markerImages = {
    Completed: "/free-map-marker-icon-green.png",
    WIP: "/free-map-marker-icon-orange.png",
    default: "/free-map-marker-icon-green.png",
  };

  const getMarkerImage = (status) => {
    return markerImages[status] || markerImages.default;
  };

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapboxApiAccessToken="pk.eyJ1IjoibmlraGlsc2FyYWYiLCJhIjoiY2xlc296YjRjMDA5dDNzcXphZjlzamFmeSJ9.7ZDaMZKecY3-70p9pX9-GQ" // Make sure this is your correct Mapbox access token
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
              transform: selectedPoint && selectedPoint.id === point.id ? 'scale(1.6)' : 'scale(1.0)',
              transition: 'transform 0.3s ease-out'
            }}
            onClick={(e) => {
              e.preventDefault();  // Prevent default to avoid any page navigation or other unwanted actions
              e.stopPropagation();  // Stop the event from bubbling up to the map
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
