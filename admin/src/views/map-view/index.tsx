import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
export interface MapViewProps {
  latitude?: number;
  longitude?: number;

  zoom?: number;

  onSelect?: (lat: number, lng: number) => void;

  selectable?: boolean;
}

export default function MapView({
  latitude = 21.0285,
  longitude = 105.8542,
  zoom = 13,
  selectable = false,
  onSelect,
}: MapViewProps) {
  const [position, setPosition] = useState<[number, number]>([
    latitude,
    longitude,
  ]);

  useEffect(() => {
  if (latitude != null && longitude != null) {
    setPosition([latitude, longitude]);
  }
}, [latitude, longitude]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (!selectable) return;

        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onSelect?.(lat, lng);
      },
    });

    return <Marker position={position} />;
  }

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker />

      <Popup position={position}>
        Lat: {position[0].toFixed(6)} <br />
        Lng: {position[1].toFixed(6)}
      </Popup>
    </MapContainer>
  );
}