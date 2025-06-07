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
                className="w-full border rounded-lg p-2"
            />
            {suggestions.length > 0 && (
                <div className="mt-2 border rounded-lg bg-white shadow max-h-60 overflow-y-auto">
                    {suggestions.map((s) => (
                        <button
                            key={s.place_id}
                            onClick={() => {
                                onSelect(s.description);
                                setInput('');
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                        >
                            {s.description}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
