"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { Bath, BedDouble, MapPin, Ruler, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function UserListing() {
  const { user } = useUser();
  const [listing, setListing] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    user && GetUserListing();
  }, [user]);

  const GetUserListing = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select("*,listingImages(url,listing_id)")
      .eq("createdBy", user?.primaryEmailAddress.emailAddress);

    console.log(data);

    if (data) {
      setListing(data);
    }
    if (error) {
      toast("Server side error!");
    }
  };

  const handleDelete = async(listingId) => {
    setLoading(true);
    try{
      const {error : imageError} = await supabase
         .from('listingImages')
         .delete()
         .eq('listing_id', listingId);

         if(imageError) {
          toast('Server side error')
          throw imageError;
         }

      const {error: listingError} = await supabase
         .from('listing')
         .delete()
         .eq('id', listingId)

         if(listingError) {
          toast('Server side error')
          throw listingError;
         }

         setListing((prev) => prev.filter((item) => item.id !== listingId));
         toast("Property Deleted Successfully!")
    } catch (err) {
      console.error('Delete error:', err)
      toast("Failed to delete property")
    } finally{
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="font-bold text-2xl">Manage your listing</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {listing &&
          listing.map((item, index) => (
            <div
              key={index}
              className="p-3 hover:border hover:border-primary cursor-pointer rounded-lg"
            >
              <h2 className="bg-primary m-1 rounded-lg text-white absolute px-2 text-sm p-1">
                {item.active ? "Published" : "Draft"}
              </h2>
              <Image
                src={
                  item?.listingImages[0]
                    ? item?.listingImages[0]?.url
                    : "/placeholder.jpg"
                }
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
                <div className="flex gap-2">
                  <Link href={"/view-listing/" + item.id} className="w-1/3">
                    <Button size="sm" variant="outline" className="w-full">
                      View
                    </Button>
                  </Link>
                  <Link href={"/edit-listing/" + item.id} className="w-1/3">
                    <Button size="sm" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" disabled={loading}>
                        <Trash />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your property listing and all its data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.id)} className='bg-destructive hover:bg-destructive/90' disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default UserListing;
