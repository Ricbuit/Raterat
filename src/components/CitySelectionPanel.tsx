import { useEffect, useRef, useState } from 'react';
import type { Suggestion } from '../types';
import { fetchCities, saveCity } from '../services/Firestore';

interface CategoryPanelProps {
    onCitySelect: (city: string) => void;
    cities: string[];
    setCities: (cities: string[]) => void;
}

export default function CitySelectionPanel({ onCitySelect, cities, setCities }: CategoryPanelProps) {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);

    useEffect(() => {
        if (window.google?.maps?.places) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
        }
    }, []);

    useEffect(() => {
        void (async () => {
            try {
                const cityNames = await fetchCities();
                setCities(cityNames);
            } catch (err) {
                console.error('Failed to load cities:', err);
            }
        })();
    }, [setCities]);

    useEffect(() => {
        if (!input || !autocompleteService.current) {
            setSuggestions([]);
            return;
        }

        void autocompleteService.current.getPlacePredictions(
            {
                input,
                types: ['(cities)'],
                componentRestrictions: { country: ['nl', 'de'] },
            },
            (predictions) => {
                if (predictions) {
                    setSuggestions(predictions.map((p) => ({ description: p.description, place_id: p.place_id })));
                } else {
                    setSuggestions([]);
                }
            }
        );
    }, [input]);

    const handleSelect = async (desc: string) => {
        const cityName = desc.split(',')[0];

        if (!cities.includes(cityName)) {
            setCities([...cities, cityName]);

            try {
                await saveCity(cityName);
            } catch (err) {
                console.error('Failed to save city to Firestore:', err);
            }
        }

        setInput('');
        setSuggestions([]);
    };

    return (
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
                            onClick={() => handleSelect(s.description)}
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
                            onClick={() => onCitySelect(c)}
                            className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg w-full hover:bg-blue-200 text-left"
                        >
                            {c}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
