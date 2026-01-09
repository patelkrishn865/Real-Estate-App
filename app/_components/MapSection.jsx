'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerItem from './MarkerItem';

const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

const DEFAULT_CENTER = [21.1702, 72.8311]; 
const DEFAULT_ZOOM = 12;
const SEARCH_ZOOM = 15; 

function ChangeMapView({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords && coords.lat && coords.lng) {
      map.flyTo([coords.lat, coords.lng], SEARCH_ZOOM, {
        duration: 2, 
      });
    }
  }, [coords, map]);

  return null;
}

const MapSection = ({ coordinates, listing }) => {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return (
      <div className="h-full w-full bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  const initialCenter = coordinates?.lat && coordinates?.lng
    ? [coordinates.lat, coordinates.lng]
    : DEFAULT_CENTER;

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-2xl">
      <MapContainer
        center={initialCenter}
        zoom={coordinates ? SEARCH_ZOOM : DEFAULT_ZOOM}
        zoomControl={true}
        scrollWheelZoom={true}
        style={{ height: '80vh', width: '100%', borderRadius: 10, zIndex: 0 }}
      >
        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`}
          attribution='© <a href="https://www.geoapify.com/">Geoapify</a> | © OpenStreetMap contributors'
        />

        <ChangeMapView coords={coordinates} />

        {listing.map((item, index) => (
          <MarkerItem 
            key={index}
            item={item}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapSection;