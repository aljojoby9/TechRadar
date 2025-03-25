interface StaticMapProps {
  address: string;
  width?: number;
  height?: number;
  zoom?: number;
}

export default function StaticMap({ 
  address, 
  width = 600, 
  height = 400, 
  zoom = 15 
}: StaticMapProps) {
  // You'll need to replace this with your actual Google Maps API key
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  // Encode the address for the URL
  const encodedAddress = encodeURIComponent(address);
  
  // Construct the static map URL
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=${zoom}&size=${width}x${height}&markers=color:red%7C${encodedAddress}&key=${apiKey}`;

  return (
    <div className="relative w-full h-full">
      <img
        src={mapUrl}
        alt={`Map showing ${address}`}
        className="w-full h-full object-cover rounded-lg shadow-lg"
      />
      <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-md shadow-md text-sm">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          View on Google Maps
        </a>
      </div>
    </div>
  );
} 