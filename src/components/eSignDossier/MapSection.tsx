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
  const { map: translations } = messages.dossier;

  const fallback = (
    <StaticMapFallback
      lat={signatory.coordinates.lat}
      lon={signatory.coordinates.lon}
    />
  );

  return (
    <div>
      <h3 className="text-lg font-semibold font-mono text-brand-blue-dark mb-2">
        {translations.title}
      </h3>

      <div className="text-sm text-gray-700 mb-2 flex flex-wrap gap-x-2 gap-y-1">
        <span>
          <strong>{translations.address}:</strong> {signatory.address},{" "}
          {signatory.neighborhood}
        </span>
        <span className="hidden sm:inline">|</span>
        <span>
          <strong>{translations.zipCode}:</strong> {signatory.zipCode}
        </span>
        <span className="hidden sm:inline">|</span>
        <span>
          <strong>{translations.city}:</strong> {signatory.city}
        </span>
        <span className="hidden sm:inline">|</span>
        <span>
          <strong>{translations.country}:</strong> {signatory.country}
        </span>
      </div>

      <p className="text-xs text-gray-500 italic mb-1">
        {translations.approximate}
      </p>

      <Suspense fallback={fallback}>
        <MapErrorBoundary fallback={fallback}>
          <DynamicMap
            lat={signatory.coordinates.lat}
            lon={signatory.coordinates.lon}
          />
        </MapErrorBoundary>
      </Suspense>

      <p className="text-xs text-gray-500 mt-1">
        {translations.coordinates}: {signatory.coordinates.lat},{" "}
        {signatory.coordinates.lon}
      </p>
    </div>
  );
}
