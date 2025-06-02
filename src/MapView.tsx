import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';

interface MapViewProps {
    city: string;
}

const containerStyle = {
    width: '100%',
    height: '100vh',
};

const LIBRARIES: ('marker')[] = ['marker'];

const mapOptions = {
    mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
    disableDefaultUI: false,
    mapTypeId: 'roadmap',
};

export default function MapView({ city }: MapViewProps) {
    const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    useEffect(() => {
        if (!isLoaded || !window.google || !window.google.maps || !city) return;

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: city }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const location = results[0].geometry.location;
                const newCenter = { lat: location.lat(), lng: location.lng() };
                setCenter(newCenter);
            } else {
                console.error(`Geocoding failed: ${status}`);
            }
        });
    }, [city, isLoaded]);

    if (!isLoaded || !center) return <div className="text-center">Loading map...</div>;

    return (
        <div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={14}
                options={mapOptions}
                onLoad={(map: google.maps.Map) => {
                    mapRef.current = map;
                }}
            />
        </div>
    );
}
