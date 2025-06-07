import { useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import MapView from './MapView';
import CategoryPanel from './components/CategoryPanel.tsx';
import CitySelectionPanel from './components/city_selection_panel/CitySelectionPanel.tsx';
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
                <CategoryPanel city={selectedCity} onBack={() => setSelectedCity(null)} />
            ) : (
                <CitySelectionPanel cities={cities} setCities={setCities} onCitySelect={setSelectedCity} />
            )}

            <div className="flex-1 h-full">
                <MapView city={selectedCity} />
            </div>
        </div>
    );
}

export default App;
