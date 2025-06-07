import { useEffect, useRef, useState } from 'react';
import type { Suggestion } from '../../types';

export function CityAutocomplete(input: string) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);

    useEffect(() => {
        if (window.google?.maps?.places) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
        }
    }, []);

    useEffect(() => {
        if (!input || !autocompleteService.current) {
            setSuggestions([]);
            return;
        }

        autocompleteService.current.getPlacePredictions(
            {
                input,
                types: ['(cities)'],
                componentRestrictions: { country: ['nl', 'de'] },
            },
            (predictions) => {
                setSuggestions(predictions?.map(p => ({
                    description: p.description,
                    place_id: p.place_id,
                })) || []);
            }
        );
    }, [input]);

    return suggestions;
}
