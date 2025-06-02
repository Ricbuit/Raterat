import { useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import MapView from './MapView';
import CityPanel from './components/CityPanel';
import SearchPanel from './components/SearchPanel';
import { MAP_LIBRARIES } from './MapConfig';

function App() {
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [cities, setCities] = useState<string[]>([]);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: MAP_LIBRARIES,
    });

    if (!isLoaded) return <div className="text-center p-4">Loading Google Maps...</div>;

    return (
        <div className="h-screen w-screen flex overflow-hidden">
            {selectedCity ? (
                <CityPanel city={selectedCity} onBack={() => setSelectedCity(null)} />
            ) : (
                <SearchPanel cities={cities} setCities={setCities} onCitySelect={setSelectedCity} />
            )}

            <div className="flex-1 h-full">
                <MapView city={selectedCity} />
            </div>
        </div>
    );
}

export default App;
