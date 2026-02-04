import React, { useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 14.5995,
  lng: 120.9842,
};

const MapView = ({ origin, destination }: { origin: any; destination: any }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const directionsService = useRef<google.maps.DirectionsService | null>(null);
  const [directions, setDirections] = React.useState<google.maps.DirectionsResult | null>(null);

  const calculateRoute = useCallback(() => {
    if (!isLoaded || !origin || !destination) return;

    if (!directionsService.current)
      directionsService.current = new google.maps.DirectionsService();

    directionsService.current.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }, [origin, destination, isLoaded]);

  React.useEffect(() => {
    calculateRoute();
  }, [calculateRoute]);

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      {directions ? (
        <DirectionsRenderer directions={directions} />
      ) : (
        <>
          {origin && <Marker position={origin} />}
          {destination && <Marker position={destination} />}
        </>
      )}
    </GoogleMap>
  );
};

export default MapView;
