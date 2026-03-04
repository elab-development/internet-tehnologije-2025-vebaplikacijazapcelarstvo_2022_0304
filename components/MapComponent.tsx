"use client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function LocationPicker({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lon: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface MapProps {
  latitude?: number | null;
  longitude?: number | null;
  onLocationSelect?: (lat: number, lon: number) => void;
  interactive?: boolean;
}

export default function MapComponent({
  latitude,
  longitude,
  onLocationSelect,
  interactive = false,
}: MapProps) {
  const defaultCenter: [number, number] = [44.0, 21.0];
  const center: [number, number] =
    latitude && longitude ? [latitude, longitude] : defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={latitude ? 13 : 7}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {interactive && onLocationSelect && (
        <LocationPicker onLocationSelect={onLocationSelect} />
      )}
      {latitude && longitude && (
        <Marker position={[latitude, longitude]}>
          <Popup>Lokacija košnice</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
