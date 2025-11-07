import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapComponentProps {
  latitude: number | undefined;
  longitude: number | undefined;
}

const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) {
      // If coordinates are invalid, ensure map is not shown or destroyed
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      return;
    }

    const coords: L.LatLngExpression = [latitude, longitude];

    if (!mapRef.current) {
      // Initialize map if it doesn't exist
      if (mapContainerRef.current) {
        mapRef.current = L.map(mapContainerRef.current).setView(coords, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapRef.current);
        markerRef.current = L.marker(coords).addTo(mapRef.current);
      }
    } else {
      // Update existing map
      mapRef.current.setView(coords, 13);
      markerRef.current?.setLatLng(coords);
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]); // Re-run effect if latitude or longitude changes

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg fade-in">
      <h2 className="text-xl font-semibold text-white mb-4">Location Map</h2>
      <div id="map" ref={mapContainerRef} className="h-64 rounded-lg"></div>
    </div>
  );
};

export default MapComponent;
