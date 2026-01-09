'use client';
import { supabase } from '@/utils/supabase/client'
import React, { use, useEffect, useState } from 'react'
import { toast } from 'sonner';
import Slider from '../_components/Slider';
import Details from '../_components/Details';

function ViewListing({ params }) {

  const [listingDetail, setListingDetail] = useState(null);

  const { id } = use(params);

  useEffect(() => {
   if(id) GetListingDetail();
  },[id])

  const GetListingDetail = async() => {
    const { data, error } = await supabase
       .from('listing')
       .select('*,listingImages(url, listing_id)')
       .eq('id', id)
       .eq('active', true)

       if(data) {
        setListingDetail(data[0]);
       }
       if(error) {
        toast("Server side error")
       }
  }

  return (
    <div className='px-4 py-5 md:px-32 lg:px-56'>
      <Slider imageList={listingDetail?.listingImages} />
      <Details listingDetail={listingDetail} />
    </div>
  )
}

export default ViewListing