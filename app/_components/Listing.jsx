"use client";
import { Bath, BedDouble, MapPin, Ruler, Search } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import GeoapifyAddressSearch from "./GoogleAddressSearch";
import { Button } from "@/components/ui/button";
import FilterSection from "./FilterSection";
import Link from "next/link";

function Listing({
  listing,
  handleSearchClick,
  setSelectedAddress,
  setCoordinates,
  setBedCount,
  setBathCount,
  setParkingCount,
  setHomeType,
}) {
  const [searchedAddress, setSearchedAddress] = useState();

  const handlePlaceSelect = (address, coords) => {
    setSelectedAddress(address);
    setCoordinates(coords);
    setSearchedAddress(address);
  };

  return (
    <div>
      <div className="p-3 flex gap-6 items-center">
        <GeoapifyAddressSearch onPlaceSelect={handlePlaceSelect} />
        <Button className="flex gap-2" onClick={handleSearchClick}>
          <Search className="h-4 w-4" /> Search
        </Button>
      </div>
      <FilterSection
        setBedCount={setBedCount}
        setBathCount={setBathCount}
        setParkingCount={setParkingCount}
        setHomeType={setHomeType}
      />
      {searchedAddress && (
        <div className="px-3 my-5">
          <h2 className="text-xl">
            Found <span className="font-bold">{listing?.length}</span> Result in{" "}
            <span className="text-primary font-bold">{searchedAddress}</span>
          </h2>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {listing.length > 0
          ? listing.map((item, index) => (
              <Link href={'/view-listing/'+ item.id} key={index}>
                 <div
                key={index}
                className="p-3 hover:border hover:border-primary cursor-pointer rounded-lg"
              >
                <Image
                  src={item?.listingImages[0]?.url}
                  alt="img"
                  width={800}
                  height={150}
                  className="rounded-lg object-cover h-42.5"
                />
                <div className="flex mt-2 flex-col gap-2">
                  <h2 className="font-bold text-xl">${item.sellingPrice}</h2>
                  <h2 className="flex gap-2 text-sm text-gray-400">
                    <MapPin className="h-4 w-4" />
                    {item.address}
                  </h2>
                  <div className="flex gap-2 justify-between mt-2">
                    <h2 className="flex gap-2 text-sm bg-slate-200 w-full rounded-md text-gray-500 p-2 items-center justify-center">
                      <BedDouble className="h-4 w-4" />
                      {item?.bedroom}
                    </h2>
                    <h2 className="flex gap-2 text-sm bg-slate-200 w-full rounded-md text-gray-500 p-2 items-center justify-center">
                      <Bath className="h-4 w-4" />
                      {item?.bathroom}
                    </h2>
                    <h2 className="flex gap-2 text-sm bg-slate-200 w-full rounded-md text-gray-500 p-2 items-center justify-center">
                      <Ruler className="h-4 w-4" />
                      {item?.area}
                    </h2>
                  </div>
                </div>
              </div>
              </Link>
            ))
          : [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
              <div
                key={index}
                className="h-57.5 w-full bg-slate-200 rounded-lg animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default Listing;
