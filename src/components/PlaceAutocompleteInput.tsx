import { useEffect, useRef, useState } from 'react';

interface Suggestion {
    description: string;
    place_id: string;
}

interface Props {
    city: string;
    onSelect: (place: string) => void;
}

export default function PlaceAutocompleteInput({ onSelect }: Props) {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
    const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

    useEffect(() => {
        if (window.google && window.google.maps.places) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
            sessionToken.current = new window.google.maps.places.AutocompleteSessionToken(); // ✅ moved here
        }
    }, []);

    useEffect(() => {
        if (!input || !autocompleteService.current || !sessionToken.current) {
            setSuggestions([]);
            return;
        }

        autocompleteService.current.getPlacePredictions(
            {
                input, // 👈 no extra ", city" here to help suggestions
                types: ['establishment'],
                componentRestrictions: { country: ['nl', 'de'] },
                sessionToken: sessionToken.current,
            },
            (predictions) => {
                if (predictions) {
                    setSuggestions(
                        predictions.map((p) => ({
                            description: p.description,
                            place_id: p.place_id,
                        }))
                    );
                } else {
                    setSuggestions([]);
                }
            }
        );
    }, [input]);

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
                <div className="border rounded-lg bg-white shadow max-h-48 overflow-y-auto">
                    {suggestions.map((s) => {
                        const shortLabel = s.description.split(',')[0];
                        return (
                            <button
                                key={s.place_id}
                                onClick={() => {
                                    onSelect(shortLabel);
                                    setInput('');
                                    setSuggestions([]);
                                    sessionToken.current = new window.google.maps.places.AutocompleteSessionToken(); // 🔁 reset session
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
