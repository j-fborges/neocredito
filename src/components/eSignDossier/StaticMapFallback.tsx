interface StaticMapFallbackProps {
  lat: number;
  lon: number;
  zoom?: number;
  width?: number;
  height?: number;
}

// Helper para renderizar mapa estático. https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames

function getTileCoordinates(lat: number, lon: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const xtile = Math.floor(((lon + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const ytile = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  );
  return { x: xtile, y: ytile };
}

function getTileUrl(lat: number, lon: number, zoom = 14) {
  const { x, y } = getTileCoordinates(lat, lon, zoom);
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
}

export default function StaticMapFallback({
  lat,
  lon,
  zoom = 14,
  width = 400,
  height = 200,
}: StaticMapFallbackProps) {
  const tileUrl = getTileUrl(lat, lon, zoom);
  const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=${zoom}`;

  return (
    <figure className="my-2">
      <a href={osmLink} target="_blank" rel="noopener noreferrer">
        <img
          src={tileUrl}
          alt={`Mapa da localização ${lat}, ${lon}`}
          width={width}
          height={height}
          className="rounded border border-gray-300 shadow-sm"
          loading="lazy"
        />
      </a>
      <figcaption className="text-xs text-gray-500 mt-1">
        Local aproximado — clique para ampliar no OpenStreetMap
      </figcaption>
    </figure>
  );
}
