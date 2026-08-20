import React, { useEffect, useRef, useState } from 'react';
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { Search, Loader2, Navigation, Compass, MapPin, X } from 'lucide-react';

interface MapPickerProps {
    initialLat?: number;
    initialLng?: number;
    onLocationChange?: (location: { latitude: number; longitude: number; address?: string }) => void;
}

interface GeocodingFeature {
    id: string;
    place_name: string;
    center: [number, number];
}

export default function MapPicker({
    initialLat = 23.0225, // Ahmedabad default
    initialLng = 72.5714,
    onLocationChange,
}: MapPickerProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maptilersdk.Map | null>(null);
    const marker = useRef<maptilersdk.Marker | null>(null);

    const [coordinates, setCoordinates] = useState<{
        latitude: number | null;
        longitude: number | null;
    }>({
        latitude: initialLat,
        longitude: initialLng,
    });

    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);
    const [suggestions, setSuggestions] = useState<GeocodingFeature[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [resolvedAddress, setResolvedAddress] = useState("");

    // Helper to update location, reverse geocode, and notify parent
    const updateLocation = async (lat: number, lng: number) => {
        const roundedLat = Number(lat.toFixed(6));
        const roundedLng = Number(lng.toFixed(6));

        setCoordinates({
            latitude: roundedLat,
            longitude: roundedLng,
        });

        let address = '';
        try {
            const key =
                import.meta.env.VITE_MAPTILER_API_KEY ||
                import.meta.env.VITE_MAP_TILER ||
                'ahCrt76zZbGH3ATYy6Di';
            maptilersdk.config.apiKey = key;

            const result = await maptilersdk.geocoding.reverse([lng, lat]);
            if (result?.features && result.features.length > 0) {
                address = result.features[0].place_name || '';
                setResolvedAddress(address);
            }
        } catch (err) {
            console.error("Reverse geocoding error:", err);
        }

        if (onLocationChange) {
            onLocationChange({
                latitude: roundedLat,
                longitude: roundedLng,
                address,
            });
        }
    };

    // Initialize Map
    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        const key =
            import.meta.env.VITE_MAPTILER_API_KEY ||
            import.meta.env.VITE_MAP_TILER ||
            'ahCrt76zZbGH3ATYy6Di';
        maptilersdk.config.apiKey = key;

        const mapTiler = new maptilersdk.Map({
            container: mapContainer.current,
            center: [initialLng, initialLat],
            zoom: 13,
            style: maptilersdk.MapStyle.STREETS,
        });

        map.current = mapTiler;

        const markerInstance = new maptilersdk.Marker({
            draggable: true,
            color: '#10b981',
        })
            .setLngLat([initialLng, initialLat])
            .addTo(mapTiler);

        marker.current = markerInstance;

        // Marker drag event
        markerInstance.on("dragend", () => {
            const position = markerInstance.getLngLat();
            updateLocation(position.lat, position.lng);
        });

        // Map click event
        mapTiler.on("click", (event) => {
            const { lat, lng } = event.lngLat;
            markerInstance.setLngLat([lng, lat]);
            updateLocation(lat, lng);
            setShowSuggestions(false);
        });

        return () => {
            mapTiler.remove();
            map.current = null;
            marker.current = null;
        };
    }, [initialLat, initialLng]);

    // Select a location from suggestions or search result
    const selectLocation = (lng: number, lat: number, address: string) => {
        const roundedLat = Number(lat.toFixed(6));
        const roundedLng = Number(lng.toFixed(6));

        setCoordinates({
            latitude: roundedLat,
            longitude: roundedLng,
        });
        setResolvedAddress(address);
        setSearch(address);
        setShowSuggestions(false);

        if (map.current) {
            map.current.flyTo({
                center: [lng, lat],
                zoom: 15,
                essential: true,
            });
        }

        if (marker.current) {
            marker.current.setLngLat([lng, lat]);
        }

        if (onLocationChange) {
            onLocationChange({
                latitude: roundedLat,
                longitude: roundedLng,
                address,
            });
        }
    };

    // Live Geocoding Search handler (NO form submit to avoid parent modal form triggering)
    const handleSearch = async (e?: React.MouseEvent | React.KeyboardEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!search.trim()) return;

        setSearching(true);
        try {
            const key =
                import.meta.env.VITE_MAPTILER_API_KEY ||
                import.meta.env.VITE_MAP_TILER ||
                'ahCrt76zZbGH3ATYy6Di';
            maptilersdk.config.apiKey = key;

            const proximity: [number, number] | undefined =
                coordinates.longitude && coordinates.latitude
                    ? [coordinates.longitude, coordinates.latitude]
                    : undefined;

            const result = await maptilersdk.geocoding.forward(search, {
                limit: 5,
                proximity,
            });

            if (result?.features && result.features.length > 0) {
                setSuggestions(result.features as GeocodingFeature[]);
                setShowSuggestions(true);

                // Automatically fly to first matching feature
                const first = result.features[0];
                const [lng, lat] = first.center;
                const address = first.place_name || search;
                selectLocation(lng, lat, address);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } catch (error) {
            console.error("Error searching for location:", error);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="space-y-3">
            {/* Search Location Input Bar - Wrapped in div (NOT nested form) */}
            <div className="relative">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                if (!e.target.value) setShowSuggestions(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSearch(e);
                                }
                            }}
                            placeholder="Search area, landmark, turf (e.g. Bopal Ahmedabad, Bandra Mumbai)..."
                            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setShowSuggestions(false);
                                }}
                                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleSearch}
                        disabled={searching}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                        {searching ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Navigation size={14} />
                        )}
                        {searching ? "Searching..." : "Search"}
                    </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-30 overflow-hidden text-xs max-h-48 overflow-y-auto">
                        {suggestions.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    const [lng, lat] = item.center;
                                    selectLocation(lng, lat, item.place_name);
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-start gap-2 text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700/50 last:border-0 cursor-pointer"
                            >
                                <MapPin size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{item.place_name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map Container Canvas */}
            <div
                ref={mapContainer}
                className="w-full h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner bg-slate-100 dark:bg-slate-800 relative"
            />

            {/* Selected Coordinates Badges */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex items-center gap-2">
                    <Compass size={15} className="text-emerald-600 shrink-0" />
                    <div>
                        <span className="text-slate-400">Latitude: </span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {coordinates.latitude !== null ? coordinates.latitude : "--"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Compass size={15} className="text-emerald-600 shrink-0" />
                    <div>
                        <span className="text-slate-400">Longitude: </span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {coordinates.longitude !== null ? coordinates.longitude : "--"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Resolved Address Banner */}
            {resolvedAddress && (
                <div className="flex items-start gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                    <MapPin size={15} className="shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{resolvedAddress}</span>
                </div>
            )}
        </div>
    );
}
