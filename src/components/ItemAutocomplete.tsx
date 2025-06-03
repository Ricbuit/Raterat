import { useEffect, useRef, useState } from 'react';
import type {Suggestion} from "../types";
import { haversineDistance } from '../utils/Haversine';

interface Props {
    city: string;
    onSelect: (place: string) => void;
}

export default function ItemAutocomplete({ city, onSelect }: Props) {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
    const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
    const [cityCoords, setCityCoords] = useState<google.maps.LatLng | null>(null);

    useEffect(() => {
        if (window.google && window.google.maps.places) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
            sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();

            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: city }, (results, status) => {
                if (status === 'OK' && results?.[0]?.geometry?.location) {
                    setCityCoords(results[0].geometry.location);
                } else {
                    console.warn('Failed to geocode city:', status);
                }
            });
        }
    }, [city]);

    useEffect(() => {
        if (!input || !autocompleteService.current || !sessionToken.current || !cityCoords) {
            setSuggestions([]);
            return;
        }

        void autocompleteService.current.getPlacePredictions(
            {
                input,
                sessionToken: sessionToken.current,
                locationBias: {
                    radius: 10000,
                    center: cityCoords,
                },
                componentRestrictions: { country: ['nl', 'de'] },
            },
            (predictions) => {
                if (!predictions || predictions.length === 0) {
                    setSuggestions([]);
                    return;
                }

                const service = new window.google.maps.places.PlacesService(document.createElement('div'));

                const promises = predictions.map((p) =>
                    new Promise<Suggestion | null>((resolve) => {
                        service.getDetails({ placeId: p.place_id }, (place, status) => {
                            if (
                                status === google.maps.places.PlacesServiceStatus.OK &&
                                place?.geometry?.location
                            ) {
                                const coords = place.geometry.location.toJSON();
                                const dist = haversineDistance(cityCoords.toJSON(), coords);
                                if (dist <= 10000) {
                                    resolve({ description: p.description, place_id: p.place_id });
                                } else {
                                    resolve(null);
                                }
                            } else {
                                resolve(null);
                            }
                        });
                    })
                );

                Promise.all(promises).then((results) => {
                    const filtered = Array.from(
                        new Map(
                            results
                                .filter((s): s is Suggestion => s !== null)
                                .map((s) => [s.description.split(',')[0], s])
                        ).values()
                    );

                    setSuggestions(filtered.slice(0, 5));
                });
            }
        );
    }, [input, cityCoords]);

    return (
        <div>
            <input
                type="text"
                placeholder="Add item to category..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full border rounded-lg p-2 mb-1"
            />
            {suggestions.length > 0 && (
                <div className="border rounded-lg bg-white shadow">
                    {suggestions.map((s) => {
                        const shortLabel = s.description.split(',')[0];
                        return (
                            <button
                                key={s.place_id}
                                onClick={() => {
                                    onSelect(shortLabel);
                                    setInput('');
                                    setSuggestions([]);
                                    sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                            >
                                {shortLabel}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
