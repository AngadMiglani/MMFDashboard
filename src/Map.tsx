import "mapbox-gl/dist/mapbox-gl.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import React, { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Carousel } from "react-responsive-carousel";
import { fetchImagesFromDriveFolder } from "./driveUtils";

const GOOGLE_API_KEY = "AIzaSyADWvsv4yDUy257HC8icbKkrgRUgQFOi9k";

// Modal Component
const ImageModal = ({ imageUrls, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <Carousel>
        {imageUrls.map((url, i) => (
          <div key={i}>
            <img src={url} alt={`Image ${i + 1}`} style={{ width: "100%" }} />
          </div>
        ))}
      </Carousel>
      <button className="modal-close" onClick={onClose}>X</button>
    </div>
  </div>
);

// Legend Component (unchanged)
const Legend = () => (
  <div className="legend-box">
    {/* ... icon list as earlier ... */}
  </div>
);

const Map = ({ data }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const markerImages = {
    Completed: "/free-map-marker-icon-green-darker.png",
    WIP: "/free-map-marker-icon-green.png",
    Allocated: "/free-map-marker-icon-blue-darker.png",
    "Not Qualified": "/free-map-marker-icon-red.png",
    Qualified: "/free-map-marker-icon-orange.png",
    default: "/free-map-marker-icon-orange.png",
  };

  const getMarkerImage = (point) => markerImages[point.status] || markerImages.default;

  const handleImageClick = async (folderUrl) => {
    const images = await fetchImagesFromDriveFolder(folderUrl, GOOGLE_API_KEY);
    setImageUrls(images);
  };

  const closeModal = () => setImageUrls([]);

  return (
    <>
      <ReactMapGL
        initialViewState={{ zoom: 9, latitude: 28.53, longitude: 77.22 }}
        mapboxAccessToken="your-mapbox-token"
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ width: "100%", height: "100%" }}
      >
        <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
          <Legend />
        </div>

        {data.map((point) => (
          <Marker key={point.id} latitude={point.latitude} longitude={point.longitude}>
            <button
              style={{
                border: "none",
                background: "transparent",
                width: selectedMarker === point ? "54px" : "40px",
                height: selectedMarker === point ? "48px" : "32px",
              }}
              onClick={() => setSelectedMarker(point)}
            >
              <img src={getMarkerImage(point)} alt="Marker" style={{ width: "100%", height: "100%" }} />
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
              <p>Latitude: {selectedMarker.latitude}</p>
              <p>Longitude: {selectedMarker.longitude}</p>
              <p>Plantation Date: {selectedMarker.plantationdate}</p>
              <p>Last Inspection Date: {selectedMarker.lastinspectiondate}</p>
              {selectedMarker.image && (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleImageClick(selectedMarker.image);
                  }}
                >
                  Click to see images
                </a>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>

      {imageUrls.length > 0 && <ImageModal imageUrls={imageUrls} onClose={closeModal} />}
    </>
  );
};

export default Map;
