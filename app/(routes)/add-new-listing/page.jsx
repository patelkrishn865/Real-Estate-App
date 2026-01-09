"use client";

import GeoapifyAddressSearch from "@/app/_components/GoogleAddressSearch";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

function AddNewListing() {

  const [selectedAddress, setSelectedAddress] = useState("");
  const [coordinates, setCoordinates] = useState(null);

  const { user } = useUser();

  const router = useRouter();

  const [loader, setLoader] = useState(false);

  const handlePlaceSelect = (address, coords) => {
    setSelectedAddress(address);
    setCoordinates(coords);
  };

  const nextHandler = async() => {
    setLoader(true)
    const { data, error } = await supabase
       .from('listing')
       .insert([
        {
          address: selectedAddress,
          coordinates: coordinates,
          createdBy: user?.primaryEmailAddress.emailAddress
        }
       ])
       .select();

       if(data) 
       {
        setLoader(false)
        console.log(data)
        toast("New Address added for listing")
        router.replace('/edit-listing/'+ data[0].id)
       }

       if(error) 
       {
        setLoader(false)
        console.log('Error', error)
        toast("Server side error" + error.message)
       }
  }

  return (
    <div className="mt-10 md:mx-56 lg:mx-80">
      <div className="p-10 flex items-center justify-center flex-col gap-5">
        <h2 className="font-bold text-2xl">Add New Listing</h2>
        <div className="p-10 shadow-md w-full rounded-lg border flex flex-col gap-5">
          <h2 className="text-gray-500">
            Enter Address which you want to list
          </h2>
          <GeoapifyAddressSearch onPlaceSelect={handlePlaceSelect} />
          <Button disabled={!selectedAddress || !coordinates || loader} onClick={nextHandler}>{loader ? <Loader className="animate-spin" /> : "Next"}</Button>
        </div>
      </div>
    </div>
  );
}

export default AddNewListing;
