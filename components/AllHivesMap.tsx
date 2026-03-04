"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

interface Hive {
  id: number;
  naziv: string;
  brPcela: number;
  brRamova: number;
  createdAt: string;
  jacina: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface AllHivesMapProps {
  hives: Hive[];
  onHiveClick: (hive: Hive) => void;
}

function getJacinaColor(jacina: string): string {
  switch (jacina.toUpperCase()) {
    case "JAKA":
      return "#22c55e";
    case "SREDNJA":
      return "#eab308";
    case "SLABA":
      return "#ef4444";
    default:
      return "#6b7280";
  }
}

export default function AllHivesMap({ hives, onHiveClick }: AllHivesMapProps) {
  // Filtriraj samo košnice koje imaju lokaciju
  const hivesWithLocation = hives.filter((h) => h.latitude && h.longitude);

  return (
    <MapContainer
      center={[44.0, 21.0]}
      zoom={7}
      style={{ height: "450px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hivesWithLocation.map((hive) => (
        <Marker key={hive.id} position={[hive.latitude!, hive.longitude!]}>
          <Popup>
            <div className="text-sm">
              <p className="font-bold text-gray-800">{hive.naziv}</p>
              <p className="text-gray-600">
                🐝 {hive.brPcela.toLocaleString()} pčela
              </p>
              <p
                style={{ color: getJacinaColor(hive.jacina) }}
                className="font-semibold"
              >
                Jačina: {hive.jacina}
              </p>
              <button
                onClick={() => onHiveClick(hive)}
                className="mt-2 w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors"
              >
                Vidi detalje
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
