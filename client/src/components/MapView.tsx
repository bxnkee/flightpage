import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Airport } from '../types/index';

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  airports: Airport[];
  selectedAirports?: Airport[];
  onAirportSelect?: (airport: Airport) => void;
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  airports,
  selectedAirports = [],
  onAirportSelect,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([52.5, 5.75], 5);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add airport markers
    airports.forEach(airport => {
      const isSelected = selectedAirports.some(selected => selected.id === airport.id);
      
      const marker = L.marker([airport.latitude, airport.longitude])
        .addTo(mapInstanceRef.current!)
        .bindPopup(`
          <div class="text-center">
            <h3 class="font-bold text-gray-800">${airport.name}</h3>
            <p class="text-gray-600">${airport.city}, ${airport.country}</p>
            <p class="text-sm text-gray-500">${airport.iata} / ${airport.icao}</p>
          </div>
        `);

      if (onAirportSelect) {
        marker.on('click', () => onAirportSelect(airport));
      }

      // Highlight selected airports
      if (isSelected) {
        marker.setIcon(L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
          className: 'selected-airport-marker'
        }));
      }

      markersRef.current.push(marker);
    });

    // Draw route if two airports are selected
    if (selectedAirports.length === 2) {
      const [from, to] = selectedAirports;
      const routeLine = L.polyline([
        [from.latitude, from.longitude],
        [to.latitude, to.longitude]
      ], {
        color: '#0ea5e9',
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 10'
      }).addTo(mapInstanceRef.current);

      markersRef.current.push(routeLine as any);

      // Fit map to show both airports
      const group = new L.FeatureGroup([
        L.marker([from.latitude, from.longitude]),
        L.marker([to.latitude, to.longitude])
      ]);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [airports, selectedAirports, onAirportSelect]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden shadow-lg" />
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">European Airports</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Available Airports</span>
          </div>
          {selectedAirports.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Selected Route</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};