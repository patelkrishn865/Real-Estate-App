"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

// Replace with your key

const GeoapifyAddressSearch = ({ onPlaceSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            query
          )}&limit=6&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`
        );
        const data = await response.json();

        if (data.features) {
          setSuggestions(data.features);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Geoapify error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (feature) => {
    const props = feature.properties;
    const address = props.formatted || props.address_line1 + ", " + props.address_line2;
    const lat = feature.geometry.coordinates[1];
    const lng = feature.geometry.coordinates[0];

    if (onPlaceSelect) {
      onPlaceSelect(address, { lat, lng });
    }

    setQuery(address);
    setSuggestions([]);
    setShowDropdown(false);
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={inputRef} className="relative w-full">
      <div className="flex items-center w-full">
        <MapPin className="h-10 w-10 p-2 rounded-l-lg text-primary bg-purple-200" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Property Address"
          className="w-full px-4 py-2 border border-gray-300 rounded-r-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="off"
        />
      </div>

      {(loading || (showDropdown && suggestions.length > 0)) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading && <div className="px-4 py-2 text-gray-500">Loading...</div>}
          {suggestions.map((feature, index) => (
            <div
              key={index}
              onClick={() => handleSelect(feature)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {feature.properties.formatted}
            </div>
          ))}
        </div>
      )}

      {showDropdown && suggestions.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-2 text-gray-500">{query.length < 3 ? "Type at least 3 characters to search" : "No results found"}</div>
        </div>
      )}
    </div>
  );
};

export default GeoapifyAddressSearch;