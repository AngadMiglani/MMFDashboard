import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

const Map = ({ data }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const markerImages = {
    Completed: "/free-map-marker-icon-green.png",
    WIP: "/free-map-marker-icon-orange.png",
    default: "/free-map-marker-icon-green.png",
    selected: "/free-map-marker-icon-red.png", // New marker image for selected site
  };

  const getMarkerImage = (point, selected) => {
    if (selected) {
      return markerImages.selected; // Return the selected marker image
    }
    return markerImages[point.status] || markerImages.default;
  };

  const handleMoreInfoClick = (point) => {
    setSelectedMarker(point);
    setShowDetails(true);
  };

  return (
    <ReactMapGL
      initialViewState={{
        zoom: 9,
        latitude: 28.53,
        longitude: 77.22,
      }}
      mapboxAccessToken="pk.eyJ1IjoibmlraGlsc2FyYWYiLCJhIjoiY2xlc296YjRjMDA5dDNzcXphZjlzamFmeSJ9.7ZDaMZKecY3-70p9pX9-GQ"
      mapStyle="mapbox://styles/mapbox/streets-v11"
      style={{ width: "100%", height: "100%" }}
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
            onClick={() => {
              setSelectedMarker(point);
              setShowDetails(false);
            }}
          >
            <img
              src={getMarkerImage(point, selectedMarker === point)}
              alt="Marker"
              style={{
                width: "32px",
                height: "32px",
              }}
            />
          </button>
        </Marker>
      ))}

      {selectedMarker && (
        <Popup
          latitude={selectedMarker.latitude}
          longitude={selectedMarker.longitude}
          onClose={() => setSelectedMarker(null)}
          closeOnClick={false}
          anchor="top"
          className="mapboxgl-popup"
        >
          <div className="mapboxgl-popup-content tooltip">
            <strong>{selectedMarker.name}</strong>
            <p>Trees Planted: {selectedMarker.numsaplings}</p>
            {showDetails ? (
              <>
                <p>Address: {selectedMarker.address}</p>
                <p>Latitude: {selectedMarker.latitude}</p>
                <p>Longitude: {selectedMarker.longitude}</p>
                <p>Last Inspection Date: {selectedMarker.plantationdate}</p>
                <iframe src={selectedMarker.image} allow="autoplay"></iframe>
              </>
            ) : (
              <a onClick={() => handleMoreInfoClick(selectedMarker)}>
                View Details
              </a>
            )}
          </div>
        </Popup>
      )}
    </ReactMapGL>
  );
};

export default Map;
