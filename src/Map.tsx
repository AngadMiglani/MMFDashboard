import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

const Map = ({ data }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const markerImages = {
    "Plantation Done": "/free-map-marker-icon-green-darker.png", // Updated icon
    "Plantation WIP": "/free-map-marker-icon-orange.png", // Updated icon
    "Allocated": "/free-map-marker-icon-green.png", // New status
    "Not Qualified": "/free-map-marker-icon-pink.png", // New status
    "Qualified": "/free-map-marker-icon-blue-darker.png", // Unchanged
    default: "/free-map-marker-icon-green-darker.png", // Updated default icon
  };

  const getMarkerImage = (point) => {
    return markerImages[point.status] || markerImages.default;
  };

  const handleMoreInfoClick = (point) => {
    setSelectedMarker(point);
    setShowDetails(true);
  };

  const convertToDMS = (decimal, isLat) => {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
    const direction = decimal >= 0 ? (isLat ? "N" : "E") : (isLat ? "S" : "W");

    return `${degrees}°${minutes}'${seconds}"${direction}`;
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
              width: selectedMarker === point ? "54px" : "40px", // Increase size for selected marker
              height: selectedMarker === point ? "48px" : "32px", // Increase size for selected marker
            }}
            onClick={() => {
              setSelectedMarker(point);
              setShowDetails(false);
            }}
          >
            <img
              src={getMarkerImage(point)}
              alt="Marker"
              style={{
                width: "100%",
                height: "100%",
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
                <p>Latitude: {convertToDMS(selectedMarker.latitude, true)}</p>
                <p>Longitude: {convertToDMS(selectedMarker.longitude, false)}</p>
                <p>Last Inspection Date: {selectedMarker.plantationdate}</p>
                {selectedMarker.imageUrls.length > 0 && (
                  <a href={selectedMarker.imageUrls[0]} target="_blank" rel="noopener noreferrer">
                    Click to see images
                  </a>
                )}
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
