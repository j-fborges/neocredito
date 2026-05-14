import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export interface DynamicMapProps {
  lat: number;
  lon: number;
  zoom?: number;
  height?: string;
}

export default function DynamicMap({
  lat,
  lon,
  zoom = 14,
  height = "300px",
}: DynamicMapProps) {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height, width: "100%" }}
      className="rounded border border-gray-300 shadow-sm"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lon]}>
        <Popup>
          Local da assinatura <br /> Lat: {lat}, Lon: {lon}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
