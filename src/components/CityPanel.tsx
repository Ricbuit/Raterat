import { useState } from 'react';
import PlaceAutocompleteInput from './PlaceAutocompleteInput';

interface CityPanelProps {
    city: string;
    onBack: () => void;
}

interface Category {
    name: string;
    items: string[];
}

export default function CityPanel({ city, onBack }: CityPanelProps) {
    const [categoryInput, setCategoryInput] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);

    const handleAddCategory = () => {
        const name = categoryInput.trim();
        if (!name || categories.some((c) => c.name === name)) return;

        setCategories([...categories, { name, items: [] }]);
        setCategoryInput('');
    };

    const handleAddPlaceToCategory = (categoryName: string, placeDescription: string) => {
        setCategories((prev) =>
            prev.map((cat) =>
                cat.name === categoryName
                    ? { ...cat, items: [...cat.items, placeDescription] }
                    : cat
            )
        );
    };

    return (
        <div className="w-80 bg-white p-4 overflow-y-auto shadow-lg flex-shrink-0">
            {/* Back button */}
            <button onClick={onBack} className="mb-4 text-blue-500 hover:text-blue-700" title="Back">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <h1 className="text-xl font-bold mb-4">{city}</h1>

            {/* Add new category */}
            <input
                type="text"
                placeholder="New category"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="w-full border rounded-lg p-2 mb-2"
            />
            <button
                onClick={handleAddCategory}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full mb-4"
            >
                Add Category
            </button>

            {/* Category list */}
            {categories.map((cat) => (
                <div key={cat.name} className="mb-6">
                    <h2 className="font-semibold mb-2">{cat.name}</h2>

                    <PlaceAutocompleteInput
                        city={city}
                        onSelect={(placeName) => handleAddPlaceToCategory(cat.name, placeName)}
                    />

                    <ul className="mt-2 text-sm list-disc pl-5">
                        {cat.items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
