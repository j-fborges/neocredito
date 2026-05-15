import { Suspense, lazy } from "react";

import { messages } from "../../i18n/pt-BR";
import type { SignatoryData } from "../../types/eSignDossier";

import MapErrorBoundary from "./MapErrorBoundary";
import StaticMapFallback from "./StaticMapFallback";

const DynamicMap = lazy(() => import("./DynamicMap"));

interface MapSectionProps {
  signatory: SignatoryData;
}

export default function MapSection({ signatory }: MapSectionProps) {
  const { map } = messages.dossier;

  const fallback = (
    <StaticMapFallback
      lat={signatory.coordinates.lat}
      lon={signatory.coordinates.lon}
    />
  );

  return (
    <div>
      <h3 className="text-lg font-semibold font-mono text-brand-blue-dark mb-2">
        {map.title}
      </h3>

      <div className="text-sm text-gray-700 mb-2 flex flex-wrap gap-x-2 gap-y-1">
        <span>
          <strong>{map.address}:</strong> {signatory.address},{" "}
          {signatory.neighborhood}
        </span>
        <span className="hidden sm:inline">|</span>
        <span>
          <strong>{map.zipCode}:</strong> {signatory.zipCode}
        </span>
        <span className="hidden sm:inline">|</span>
        <span>
          <strong>{map.city}:</strong> {signatory.city}
        </span>
        <span className="hidden sm:inline">|</span>
        <span>
          <strong>{map.country}:</strong> {signatory.country}
        </span>
      </div>

      <p className="text-xs text-gray-500 italic mb-1">{map.approximate}</p>

      <Suspense fallback={fallback}>
        <MapErrorBoundary fallback={fallback}>
          <DynamicMap
            lat={signatory.coordinates.lat}
            lon={signatory.coordinates.lon}
          />
        </MapErrorBoundary>
      </Suspense>

      <p className="text-xs text-gray-500 mt-1">
        {map.coordinates}: {signatory.coordinates.lat},{" "}
        {signatory.coordinates.lon}
      </p>
    </div>
  );
}
