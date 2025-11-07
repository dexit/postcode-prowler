import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapComponentProps {
  latitude: number | undefined;
  longitude: number | undefined;
  districtBoundaryGeoJson?: any; // New prop for GeoJSON boundary data
  districtName?: string; // New prop for district name (for popups)
}

const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude, districtBoundaryGeoJson, districtName }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null); // Ref for GeoJSON layer
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (latitude === undefined || longitude === undefined) {
      // If coordinates are invalid, destroy existing map if it exists
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      return;
    }

    const coords: L.LatLngExpression = [latitude, longitude];

    if (!mapRef.current) {
      // Initialize map if it doesn't exist
      mapRef.current = L.map(mapContainerRef.current).setView(coords, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);
      markerRef.current = L.marker(coords).addTo(mapRef.current);
    } else {
      // Update existing map view and marker position
      mapRef.current.setView(coords, 13);
      markerRef.current?.setLatLng(coords);
    }

    // Cleanup for map instance on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude]); // Re-run effect if latitude or longitude changes

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear previous GeoJSON layer
    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    if (districtBoundaryGeoJson) {
      geoJsonLayerRef.current = L.geoJSON(districtBoundaryGeoJson, {
        style: {
          color: '#3b82f6', // primary-500
          weight: 3,
          opacity: 0.7,
          fillColor: '#3b82f6',
          fillOpacity: 0.2
        },
        onEachFeature: (feature, layer) => {
          if (districtName) {
            layer.bindPopup(`<b>${districtName}</b>`);
          }
        }
      }).addTo(mapRef.current);

      // Fit map to boundary and marker (if both exist)
      let featureGroup: L.FeatureGroup | null = null;
      if (markerRef.current && geoJsonLayerRef.current) {
        featureGroup = L.featureGroup([markerRef.current, geoJsonLayerRef.current]);
      } else if (geoJsonLayerRef.current) {
        featureGroup = L.featureGroup([geoJsonLayerRef.current]);
      } else if (markerRef.current) {
        featureGroup = L.featureGroup([markerRef.current]);
      }

      if (featureGroup && featureGroup.getBounds().isValid()) {
        mapRef.current.fitBounds(featureGroup.getBounds(), { padding: [50, 50] });
      }
    }
  }, [mapRef, districtBoundaryGeoJson, districtName, markerRef]); // Re-run effect if boundary data or name changes

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg fade-in">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Location Map</h2>
      <div id="map" ref={mapContainerRef} className="h-64 rounded-lg"></div>
    </div>
  );
};

export default MapComponent;