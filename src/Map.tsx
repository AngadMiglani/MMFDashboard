import "mapbox-gl/dist/mapbox-gl.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import React, { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Carousel } from "react-responsive-carousel";
import { fetchImagesFromDriveFolder } from "./driveUtils";

// Modal Component
const ImageModal = ({ imageUrls, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <Carousel showThumbs={false}>
          {imageUrls.map((url, index) => (
            <div key={index}>
              <img src={url} alt={`Site Image ${index + 1}`} style={{ width: "100%" }} />
            </div>
          ))}
        </Carousel>
        <button className="modal-close" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

// Legend Component
const Legend = () => (
  <div className="legend-box">
    <div className="legend-item">
      <img src="/free-map-marker-icon-green-darker.png" alt="Completed" />
      <span>Completed</span>
    </div>
    <div className="legend-item">
      <img src="/free-map-marker-icon-green.png" alt="WIP" />
      <span>WIP</span>
    </div>
    <div className="legend-item">
      <img src="/free-map-marker-icon-blue-darker.png" alt="Allocated" />
      <span>Allocated</span>
    </div>
    <div className="legend-item">
      <img src="/free-map-marker-icon-red.png" alt="Not Qualified" />
      <span>Not Qualified</span>
    </div>
    <div className="legend-item">
      <img src="/free-map-marker-icon-orange.png" alt="Qualified" />
      <span>Qualified</span>
    </div>
  </div>
);

const Map = ({ data }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);

  const markerImages = {
    "Completed": "/free-map-marker-icon-green-darker.png",
    "WIP": "/free-map-marker-icon-green.png",
    "Allocated": "/free-map-marker-icon-blue-darker.png",
    "Not Qualified": "/free-map-marker-icon-red.png",
    "Qualified": "/free-map-marker-icon-orange.png",
    default: "/free-map-marker-icon-orange.png",
  };

  const getMarkerImage = (point) => {
    return markerImages[point.status] || markerImages.default;
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

  const handleImageClick = async (folderId) => {
    setLoadingImages(true);
    console.log(folderId);
    const images = await fetchImagesFromDriveFolder(folderId);
    console.log(imageUrls); // add this inside your component just before rendering the modal
    setImageUrls(images);
    setLoadingImages(false);
  };

  const closeModal = () => {
    setImageUrls([]);
  };

  return (
    <>
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
        {/* Legend */}
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
              <p>Latitude: {convertToDMS(selectedMarker.latitude, true)}</p>
              <p>Longitude: {convertToDMS(selectedMarker.longitude, false)}</p>
              <p>Plantation Date: {selectedMarker.plantationdate}</p>
              <p>Last Inspection Date: {selectedMarker.lastinspectiondate}</p>
              {selectedMarker.image && (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleImageClick(selectedMarker.image); // image field now holds Drive folder ID
                  }}
                >
                  {loadingImages ? "Loading..." : "Click to see images"}
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
