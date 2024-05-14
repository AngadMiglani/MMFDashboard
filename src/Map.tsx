import "mapbox-gl/dist/mapbox-gl.css";

import React, { useEffect, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";

const Map = ({ data, onMarkerClick }) => {

  // Define your image paths
  const markerImages = {
    Completed: "/free-map-marker-icon-green.png",
    WIP: "/free-map-marker-icon-orange.png",
    default: "/free-map-marker-icon-green.png",  // Fallback if status is undefined or not matched
  };
  // Function to select image based on status
  const getMarkerImage = (status) => {
    return markerImages[status] || markerImages.default;
  };
  return (
    <ReactMapGL
      initialViewState={{
        zoom: 9,
        // center of india
        latitude: 28.53,
        longitude: 77.22,
      }}
      // {...viewport}
      // viewState={viewport}
      mapboxAccessToken={
        "pk.eyJ1IjoibmlraGlsc2FyYWYiLCJhIjoiY2xlc296YjRjMDA5dDNzcXphZjlzamFmeSJ9.7ZDaMZKecY3-70p9pX9-GQ"
      }
      // onViewportChange={(nextViewport) => setViewport(nextViewport)}
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
              width: "32px",
              height: "32px",
            }}
            onClick={() => onMarkerClick(point)}
          >
            <img
              src={getMarkerImage(point.status)}
              alt="Marker"
              style={{
                width: "32px",
                height: "32px",
              }}
            />
          </button>
        </Marker>
      ))}
    </ReactMapGL>
  );
};

export default Map;
