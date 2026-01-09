"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { Formik } from "formik";
import { usePathname, useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { toast } from "sonner";
import FileUpload from "../_components/FileUpload";
import { Loader } from "lucide-react";

function EditListing({ params }) {
  const { id } = use(params);
  const { user } = useUser();
  const router = useRouter();
  const [listing, setListing] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log(params.split('/')[2])
    user && verifyUserRecord();
  }, [user]);

  const verifyUserRecord = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select("*,listingImages(listing_id,url)")
      .eq("createdBy", user?.primaryEmailAddress.emailAddress)
      .eq("id", id);

    if (data) {
      setListing(data[0]);
    }
    if (data.length <= 0) {
      router.replace("/");
    }
  };

  const onSubmitHandler = async (formValue) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("listing")
      .update(formValue)
      .eq("id", id)
      .select();

    if (data) {
      toast("Listing updated and Published");
      setLoading(false);
    }
    for (const image of images) {
      setLoading(true);
      const file = image;
      const fileName = Date.now().toString();
      const fileExt = fileName.split(".").pop();
      const { data, error } = await supabase.storage
        .from("listingImages")
        .upload(`${fileName}`, file, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (error) {
        setLoading(false);
        toast("Error while uploading images");
      } else {
        const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;
        const { data, error } = await supabase
          .from("listingImages")
          .insert([{ url: imageUrl, listing_id: id }])
          .select();

        if (data) {
          setLoading(false);
        }

        if (error) {
          setLoading(false);
        }
      }
      setLoading(false);
    }

    if (error) {
      console.log("Error", error);
      toast(error.message);
    }
  };

  const publishBtnHandler = async() => {
    setLoading(true);
    const {data, error} = await supabase
       .from('listing')
       .update({ active: true })
       .eq('id', id)
       .select();

       if(data)
       {
        setLoading(false);
        toast('Listing published!')
       }
  }

  return (
    <div className="px-10 md:px-36 my-10">
      <h2 className="font-bold text-2xl">
        Enter some more details about your listing
      </h2>

      <Formik
        initialValues={{
          type: "",
          propertyType: "",
          profileImage: user?.imageUrl,
          fullName: user?.fullName,
        }}
        onSubmit={(values) => {
          console.log(values);
          onSubmitHandler(values);
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <div className="p-5 border rounded-lg shadow-md grid grid-cols-1 mt-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-lg text-slate-500">Rent or Sell?</h2>
                    <RadioGroup
                      onValueChange={(v) => (values.type = v)}
                      defaultValue={listing?.type}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="Rent" id="Rent" />
                        <Label htmlFor="Rent">Rent</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="Sell" id="Sell" />
                        <Label htmlFor="Sell">Sell</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-slate-500 text-lg">Property Type</h2>
                    <Select
                      onValueChange={(e) => (values.propertyType = e)}
                      defaultValue={listing?.propertyType}
                      name="propertyType"
                    >
                      <SelectTrigger className="w-45">
                        <SelectValue
                          placeholder={
                            listing?.propertyType
                              ? listing?.propertyType
                              : "Select Property Type"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Single Family House">
                            Single Family House
                          </SelectItem>
                          <SelectItem value="Town House">Town House</SelectItem>
                          <SelectItem value="Condo">Condo</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Bedroom</h2>
                    <Input
                      type="number"
                      placeholder="Ex.2"
                      defaultValue={listing?.bedroom}
                      name="bedroom"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Bathroom</h2>
                    <Input
                      type="number"
                      placeholder="Ex.2"
                      defaultValue={listing?.bathroom}
                      name="bathroom"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Built In</h2>
                    <Input
                      type="number"
                      placeholder="Ex.1900 Sq.ft"
                      defaultValue={listing?.builtIn}
                      name="builtIn"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Parking</h2>
                    <Input
                      type="number"
                      placeholder="Ex.2"
                      defaultValue={listing?.parking}
                      name="parking"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Plot Size (Sq.ft)</h2>
                    <Input
                      type="number"
                      placeholder=""
                      defaultValue={listing?.plotSize}
                      name="plotSize"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Area (Sq.ft)</h2>
                    <Input
                      type="number"
                      placeholder="Ex.1900"
                      defaultValue={listing?.area}
                      name="area"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Selling Price ($)</h2>
                    <Input
                      type="number"
                      placeholder="400000"
                      defaultValue={listing?.sellingPrice}
                      name="sellingPrice"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">HOA (Per Month) ($)</h2>
                    <Input
                      type="number"
                      placeholder="100"
                      defaultValue={listing?.hoa}
                      name="hoa"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-10 mt-10">
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Description</h2>
                    <Textarea
                      placeholder=""
                      defaultValue={listing?.description}
                      name="description"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <h2 className="text-lg text-gray-500 my-2">
                    Upload Property Images
                  </h2>
                  <FileUpload
                    setImages={(value) => setImages(value)}
                    imageList={listing?.listingImages}
                  />
                </div>
                <div className="flex gap-7 justify-end mt-10">
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="outline"
                    className="text-primary border-primary"
                  >
                    {loading ? <Loader className="animate-spin" /> : "Save"}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button disabled={loading}>
                    {loading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Save & Publish"
                    )}
                  </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Ready to Publish
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Do you really want to publish the listing?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={()=>publishBtnHandler()} >{loading ? <Loader className="animate-spin" /> : "Continue"}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default EditListing;
