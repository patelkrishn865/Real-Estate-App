"use client";

import React from "react";
import {
  BedDouble,
  Bath,
  Car,
  Ruler,
  MapPin,
  Calendar,
  Home,
} from "lucide-react";
import MapSection from "@/app/_components/MapSection";
import AgentDetail from "./AgentDetail";
import BookingBox from "./BookingBox";

function Details({ listingDetail }) {
  if (!listingDetail) {
    return null; 
  }

  const {
    address,
    sellingPrice,
    bedroom,
    bathroom,
    parking,
    area,
    plotSize,
    builtIn,
    hoa,
    description,
    fullName,
    profileImage,
    created_at,
    type,
    propertyType,
    coordinates,
    active
  } = listingDetail;

  const currentListing = [listingDetail];

  return (
    <div className="mt-10 space-y-10">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{address}</h1>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <p className="text-xl font-bold text-primary">
            ₹{sellingPrice?.toLocaleString("en-IN")}
          </p>
          <span className="bg-slate-200 text-gray-600 px-3 py-1 rounded-md text-sm font-medium">
            {type === "Sell" ? "For Sale" : "For Rent"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-200 p-4 rounded-md text-center">
          <BedDouble className="h-6 w-6 mx-auto text-gray-600 mb-1" />
          <p className="text-lg font-semibold text-gray-700">{bedroom}</p>
          <p className="text-xs text-gray-500">Bedrooms</p>
        </div>
        <div className="bg-slate-200 p-4 rounded-md text-center">
          <Bath className="h-6 w-6 mx-auto text-gray-600 mb-1" />
          <p className="text-lg font-semibold text-gray-700">{bathroom}</p>
          <p className="text-xs text-gray-500">Bathrooms</p>
        </div>
        <div className="bg-slate-200 p-4 rounded-md text-center">
          <Car className="h-6 w-6 mx-auto text-gray-600 mb-1" />
          <p className="text-lg font-semibold text-gray-700">{parking || 0}</p>
          <p className="text-xs text-gray-500">Parking</p>
        </div>
        <div className="bg-slate-200 p-4 rounded-md text-center">
          <Ruler className="h-6 w-6 mx-auto text-gray-600 mb-1" />
          <p className="text-lg font-semibold text-gray-700">{area || "N/A"}</p>
          <p className="text-xs text-gray-500">sqft Area</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-bold mb-3">About this property</h2>
        <p className="text-gray-700 leading-relaxed">
          {description ||
            "A beautiful and spacious property located in a prime area. Well-maintained with modern amenities, perfect for families."}
        </p>
      </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <h3 className="font-bold text-lg mb-4">Property Details</h3>
          <div className="space-y-3 text-gray-700 text-sm">
            <div className="flex justify-between">
              <span>Plot Size</span>
              <span className="font-medium">{plotSize || "N/A"} sqft</span>
            </div>
            <div className="flex justify-between">
              <span>Built-up Area</span>
              <span className="font-medium">{builtIn || "N/A"} sqft</span>
            </div>
            <div className="flex justify-between">
              <span>HOA Fee</span>
              <span className="font-medium">₹{hoa || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Property Type</span>
              <span className="font-medium capitalize">
                {propertyType || "Residential"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg border border-gray-200 ">
        <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          Find on Map
        </h3>

        <div className="h-96 w-full overflow-hidden border border-gray-200 rounded-lg">
        <MapSection 
            coordinates={coordinates} 
            listing={currentListing} 
          />
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="text-lg font-bold mb-3">Contact Agent</h2>
        <AgentDetail listingDetail={listingDetail} />
      </div>
      {active ? <BookingBox listing={listingDetail}/> : ""}
    </div>
  );
}

export default Details;
