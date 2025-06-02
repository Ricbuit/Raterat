import { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { MAP_LIBRARIES } from './MapConfig';
import MapView from './MapView';

interface Suggestion {
    description: string;
    place_id: string;
}

function App() {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: MAP_LIBRARIES,
    });

    useEffect(() => {
        if (isLoaded && window.google && window.google.maps.places) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
        }
    }, [isLoaded]);

    useEffect(() => {
        if (!input || !autocompleteService.current) {
            setSuggestions([]);
            return;
        }

        autocompleteService.current.getPlacePredictions(
            {
                input,
                types: ['(cities)'],
                componentRestrictions: {
                    country: ['nl', 'de'],
                },
            },
            (predictions) => {
                if (predictions) {
                    setSuggestions(predictions.map((p) => ({
                        description: p.description,
                        place_id: p.place_id,
                    })));
                } else {
                    setSuggestions([]);
                }
            }
        );
    }, [input]);

    const handleSelectCity = (city: string) => {
        const cityName = city.split(',')[0];
        if (!cities.includes(cityName)) {
            setCities([...cities, cityName]);
        }
        setSelectedCity(cityName);
        setInput('');
        setSuggestions([]);
    };

    if (!isLoaded) return <div className="text-center p-4">Loading Google Maps...</div>;

    return (
        <div className="h-screen w-screen flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 bg-white p-4 overflow-y-auto shadow-lg flex-shrink-0">
                <h1 className="text-xl font-bold mb-4">Add City</h1>
                <input
                    type="text"
                    placeholder="Start typing a city..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full border rounded-lg p-2"
                />

                {suggestions.length > 0 && (
                    <div className="mt-2 border rounded-lg bg-white shadow max-h-60 overflow-y-auto">
                        {suggestions.map((s) => (
                            <button
                                key={s.place_id}
                                onClick={() => handleSelectCity(s.description)}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                            >
                                {s.description}
                            </button>
                        ))}
                    </div>
                )}

                {cities.length > 0 && (
                    <div className="mt-6 space-y-2">
                        <h2 className="text-lg font-semibold">Added Cities</h2>
                        {cities.map((c) => (
                            <button
                                key={c}
                                onClick={() => setSelectedCity(c)}
                                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg w-full hover:bg-blue-200 text-left"
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map View */}
            <div className="flex-1 h-full">
                <MapView city={selectedCity} />
            </div>
        </div>
    );
}

export default App;
