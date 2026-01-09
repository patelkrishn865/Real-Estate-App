'use client';
import { icon } from 'leaflet';
import React, { useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import MarkerListingItem from './MarkerListingItem';

function MarkerItem({ item }) {

    const [selectedListing, setSelectedListing] = useState();
    
    const customIcon = new icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

  return (
    <div>
        <Marker position={item.coordinates} icon={customIcon} onClick={() => setSelectedListing(item)}>
            <Popup>
                <div>
                    <MarkerListingItem item={item} />
                </div>
            </Popup>
        </Marker>
    </div>
  )
}

export default MarkerItem