import ListingMapView from "./_components/ListingMapView";

export default function Home() {
  return (
    <div className="p-3">
      <ListingMapView type="Sell" />
    </div>
  );
}

//stripe listen --forward-to localhost:3000/api/stripe/webhook

