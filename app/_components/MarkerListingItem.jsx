import { Button } from "@/components/ui/button";
import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function MarkerListingItem({ item }) {
  return (
    <div>
      <div
        className=" cursor-pointer rounded-lg"
      >
        <Image
          src={item.listingImages[0].url}
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
          </div>
          <Link href={'/view-listing/'+item.id}><Button>View Detail</Button></Link>
        </div>
      </div>
    </div>
  );
}

export default MarkerListingItem;
