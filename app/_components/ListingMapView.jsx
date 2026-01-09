"use client";


import dynamic from "next/dynamic";

const MapSection = dynamic(
  () => import("@/app/_components/MapSection"),
  { ssr: false }
);

import React, { useEffect, useState } from "react";
import Listing from "./Listing";
import { supabase } from "@/utils/supabase/client";

function ListingMapView({ type }) {
  const [listing, setListing] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [bedCount, setBedCount] = useState(0);
  const [bathCount, setBathCount] = useState(0);
  const [parkingCount, setParkingCount] = useState(0);
  const [homeType, setHomeType] = useState();

  useEffect(() => {
    getLatestListing();
  }, []);

  const getLatestListing = async () => {

    const { data, error } = await supabase
      .from("listing")
      .select("*,listingImages(url,listing_id)")
      .eq("active", true)
      .eq("type", type)
      .order("id", { ascending: false });

    if (data) {
      setListing(data);
    }
    if (error) {
      toast("Server side error" + error);
    }
  };

  const handleSearchClick = async () => {
    let query = supabase
      .from("listing")
      .select("*,listingImages(url,listing_id)")
      .eq("active", true)
      .eq("type", type)
      .gte("bedroom", bedCount)
      .gte("bathroom", bathCount)
      .gte("parking", parkingCount)
      .like("address", "%" + selectedAddress + "%")
      .order("id", { ascending: false });

    if (homeType) {
      query = query.eq("propertyType", homeType);
    }

    const { data, error } = await query;
    if (data) {
      setListing(data);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Listing
          listing={listing}
          handleSearchClick={handleSearchClick}
          setSelectedAddress={setSelectedAddress}
          setCoordinates={setCoordinates}
          setBedCount={setBedCount}
          setBathCount={setBathCount}
          setParkingCount={setParkingCount}
          setHomeType={setHomeType}
        />
      </div>
      <div className="fixed right-10 h-full md:w-87.5 lg:w-112.5 xl:w-162.5">
        <MapSection coordinates={coordinates} listing={listing} />
      </div>
    </div>
  );
}

export default ListingMapView;
