import React from "react";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

export default function TechnicianMap({ locations = [], height = 180, width = 340 }) {
  const safeLocations = Array.isArray(locations) ? locations : Object.values(locations);
  const defaultCenter = { lat: 39.9526, lng: -75.1652 };
  const center = safeLocations.length
    ? { lat: safeLocations[0].lat, lng: safeLocations[0].lng }
    : defaultCenter;

  return (
    <div style={{ height, width }}>
      <Map
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: 10,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        {safeLocations.map((loc, i) =>
          typeof loc.lat === "number" && typeof loc.lng === "number" ? (
            <Marker key={loc.jobId || i} longitude={loc.lng} latitude={loc.lat} anchor="bottom">
              <div
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  boxShadow: "0 2px 8px #2563eb33",
                  whiteSpace: "nowrap"
                }}
              >
                {loc.label || `Job`}
              </div>
            </Marker>
          ) : null
        )}
      </Map>
    </div>
  );
}