import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';

interface MapViewProps {
    city: string | null;
}

const containerStyle = {
    width: '100%',
    height: '100vh',
};

const LIBRARIES: ('places' | 'marker')[] = ['places', 'marker'];

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
    const mapRef = useRef<google.maps.Map | null>(null);
    const [mapReady, setMapReady] = useState(false);
    const [initialCenter] = useState({ lat: 54.0, lng: 15.0 });
    const [initialZoom] = useState(4);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    useEffect(() => {
        if (!city || !mapReady || !window.google?.maps) return;

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: city }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
                const location = results[0].geometry.location;
                if (mapRef.current) {
                    mapRef.current.setCenter(location);
                    mapRef.current.setZoom(14);
                }
            } else {
                console.warn('Geocode failed:', status);
            }
        });
    }, [city, mapReady]);

    if (!isLoaded) return <div className="text-center">Loading map...</div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={initialCenter}
            zoom={initialZoom}
            options={mapOptions}
            onLoad={(map: google.maps.Map) => {
                mapRef.current = map;
                setMapReady(true);
            }}
        />
    );
}
