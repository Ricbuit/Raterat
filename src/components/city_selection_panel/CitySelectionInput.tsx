import { useState } from 'react';
import { CityAutocomplete } from './CityAutocomplete.tsx';

interface Props {
    onSelect: (description: string) => void;
}

export function CityInput({ onSelect }: Props) {
    const [input, setInput] = useState('');
    const suggestions = CityAutocomplete(input);

    return (
        <div>
            <input
                type="text"
                placeholder="Start typing a city..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="input city-input"
            />
            {suggestions.length > 0 && (
                <div className="suggestion">
                    {suggestions.map((s) => (
                        <button
                            key={s.place_id}
                            onClick={() => {
                                onSelect(s.description);
                                setInput('');
                            }}
                            className="btn suggestion-buttons city-suggestion-button"
                        >
                            {s.description}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
