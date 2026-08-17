import { useState, useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
} from "react-leaflet";
import { Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon problem in React/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LocationPickerProps {
    latitude: number | null;
    longitude: number | null;
    onLocationChange: (latitude: number, longitude: number) => void;
}

// Handles map click
function LocationMarker({
    latitude,
    longitude,
    onLocationChange,
}: LocationPickerProps) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            onLocationChange(lat, lng);
        },
    });

    if (latitude === null || longitude === null) {
        return null;
    }

    return <Marker position={[latitude, longitude]} />;
}

// Controls map view when search happens
function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 13);
        }
    }, [center, map]);
    return null;
}

export default function LocationPicker({
    latitude,
    longitude,
    onLocationChange,
}: LocationPickerProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Default location: Ahmedabad
    const defaultPosition: [number, number] = [23.0225, 72.5714];

    const position: [number, number] =
        latitude !== null && longitude !== null
            ? [latitude, longitude]
            : defaultPosition;

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    searchQuery
                )}`
            );
            const data = await response.json();

            console.log("data = ", data);

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newLat = parseFloat(lat);
                const newLng = parseFloat(lon);
                onLocationChange(newLat, newLng);
            } else {
                toast.error("Location not found. Try a different search term.");
            }
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Error searching for location.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                        placeholder="Search for a location (e.g. 'Mumbai', 'Andheri West')..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 dark:text-slate-100"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                    {isSearching ? <Loader2 className="animate-spin" size={18} /> : "Search"}
                </button>
            </div>

            <MapContainer
                center={position}
                zoom={13}
                style={{
                    height: "400px",
                    width: "100%",
                    borderRadius: "0.75rem",
                    zIndex: 0
                }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationMarker
                    latitude={latitude}
                    longitude={longitude}
                    onLocationChange={onLocationChange}
                />

                <MapController center={position} />
            </MapContainer>

            {latitude === null && longitude === null && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Click on the map or search to select a location.
                </p>
            )}
        </div>
    );
}