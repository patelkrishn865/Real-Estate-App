import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

function Slider({ imageList }) {


  return (
    <div>
      {imageList ? <Carousel>
        <CarouselContent>
          {imageList.map((item, index) => (
            <CarouselItem key={index}>
                <Image src={item.url} width={800} height={300} alt="img" className="rounded-xl w-full object-cover h-90" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel> 
      : <div className="w-full h-50 bg-slate-200 animate-pulse rounded-lg">

      </div>
      }
    </div>
  );
}

export default Slider;
