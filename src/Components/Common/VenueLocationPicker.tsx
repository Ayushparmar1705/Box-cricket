
import { useEffect, useRef, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

const API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

export interface VenueLocation {
  address: string;
  latitude: number;
  longitude: number;
}

export interface VenuePickerProps {
  value?: VenueLocation | null;
  onChange: (location: VenueLocation) => void;
}
export type VenueLocationPickerProps = VenuePickerProps;

interface GeocodingFeature {
  id: string;
  place_name?: string;
  text?: string;
  center: [number, number];
}

export default function VenuePicker({
  value,
  onChange,
}: VenuePickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const markerRef = useRef<maptilersdk.Marker | null>(null);

  const [query, setQuery] = useState(value?.address ?? "");
  const [results, setResults] = useState<GeocodingFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!API_KEY || !mapContainer.current || mapRef.current) return;

    maptilersdk.config.apiKey = API_KEY;

    mapRef.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: value
        ? [value.longitude, value.latitude]
        : [72.52904, 23.04009],
      zoom: value ? 15 : 11,
    });

    if (value) {
      markerRef.current = new maptilersdk.Marker()
        .setLngLat([value.longitude, value.latitude])
        .addTo(mapRef.current);
    }

    return () => {
      markerRef.current?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // Initialize the map once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function searchLocation() {
    if (!query.trim()) {
      setError("Please enter a location.");
      return;
    }

    if (!API_KEY) {
      setError("MapTiler API key is missing.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const url = new URL(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          query.trim()
        )}.json`
      );

      url.searchParams.set("key", API_KEY);
      url.searchParams.set("limit", "5");
      url.searchParams.set("country", "in");
      url.searchParams.set("language", "en");

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Location search failed.");
      }

      const data = await response.json();

      setResults(data.features ?? []);

      if (!data.features?.length) {
        setError("No locations found. Try another search.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function selectLocation(place: GeocodingFeature) {
    const [longitude, latitude] = place.center;

    const location: VenueLocation = {
      address: place.place_name ?? place.text ?? query,
      latitude,
      longitude,
    };

    onChange(location);
    setQuery(location.address);
    setResults([]);
    setError("");

    if (mapRef.current) {
      markerRef.current?.remove();

      markerRef.current = new maptilersdk.Marker()
        .setLngLat([longitude, latitude])
        .addTo(mapRef.current);

      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 15,
      });
    }
  }

  return (
    <div className="venue-picker">
      <label htmlFor="venue-location">
        Search Venue Location
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          id="venue-location"
          className="w-full border-2 border-gray-5 bg-white p-2"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void searchLocation();
            }
          }}
          placeholder="Search area or address"
        />

        <button
          type="button"
          className="bg-green-400 p-2 rounded-4"
          disabled={loading}
          onClick={() => void searchLocation()}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p role="alert">{error}</p>}

      {results.map((place) => (
        <button
          type="button"
          key={place.id}
          onClick={() => selectLocation(place)}
          style={{
            display: "block",
            width: "100%",
            padding: 10,
            textAlign: "left",
          }}
        >
          {place.place_name ?? place.text}
        </button>
      ))}

      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: 350,
          marginTop: 12,
          borderRadius: 8,
        }}
      />

      {value && (
        <div className="flex gap-4">
          <input className="border-2 border-white p-2 bg-white" type="number" value={value.latitude} onChange={(e) => onChange({ ...value, latitude: Number(e.target.value) })} />
          <input className="border-2 border-white p-2 bg-white" type="number" value={value.longitude} onChange={(e) => onChange({ ...value, longitude: Number(e.target.value) })} />
        </div>
      )}
    </div>
  );
}
