import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

const Map = ({ data }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showDetails, setShowDetails] = useState(false); // State to manage showing details

  const markerImages = {
    Completed: "/free-map-marker-icon-green-darker.png",
    WIP: "/free-map-marker-icon-pink.png",
    default: "/free-map-marker-icon-green-darker.png",
  };

  const getMarkerImage = (status) => {
    return markerImages[status] || markerImages.default;
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

      {selectedMarker && (
        <Popup
          latitude={selectedMarker.latitude}
          longitude={selectedMarker.longitude}
          onClose={() => setSelectedMarker(null)}
          closeOnClick={false}
          anchor="top"
        >
          <div className="tooltip">
            <strong>{selectedMarker.name}</strong>
            <p>Trees Planted: {selectedMarker.numsaplings}</p>
            {showDetails ? (
              <>
                <p>Address: {selectedMarker.address}</p>
                <p>Latitude: {selectedMarker.latitude}</p>
                <p>Longitude: {selectedMarker.longitude}</p>
                <p>Last Inspection Date: {selectedMarker.plantationdate}</p>
                <iframe src={selectedMarker.image} width="240" height="180" allow="autoplay"></iframe>
              </>
            ) : (
              <button onClick={() => handleMoreInfoClick(selectedMarker)}>
                Click for more Info
              </button>
            )}
          </div>
        </Popup>
      )}
    </ReactMapGL>
  );
};

export default Map;
