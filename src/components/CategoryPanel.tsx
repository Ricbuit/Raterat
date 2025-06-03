import { useEffect, useState } from 'react';
import ItemAutocomplete from './ItemAutocomplete';
import { createCategory, addItemToCategory } from '../services/Firestore';
import { db } from '../services/Firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';

interface CityPanelProps {
    city: string;
    onBack: () => void;
}

interface Category {
    name: string;
    items: string[];
}

export default function CategoryPanel({ city, onBack }: CityPanelProps) {
    const [categoryInput, setCategoryInput] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const cityRef = doc(db, 'cities', city);
        const categoriesRef = collection(cityRef, 'categories');

        const unsubscribeCategories = onSnapshot(categoriesRef, (categorySnapshot) => {
            categorySnapshot.docChanges().forEach((change) => {
                const catId = change.doc.id;
                const catRef = doc(categoriesRef, catId);
                const itemsRef = collection(catRef, 'items');

                if (change.type === 'added') {
                    const unsubscribeItems = onSnapshot(itemsRef, (itemsSnapshot) => {
                        const items = itemsSnapshot.docs.map((doc) => doc.data().name);

                        setCategories((prev) => {
                            const exists = prev.find((c) => c.name === catId);
                            if (exists) {
                                return prev.map((c) =>
                                    c.name === catId ? { ...c, items } : c
                                );
                            } else {
                                return [...prev, { name: catId, items }];
                            }
                        });
                    });

                    unsubscribes.push(unsubscribeItems);
                }

                if (change.type === 'removed') {
                    setCategories((prev) => prev.filter((c) => c.name !== catId));
                }
            });
        });

        const unsubscribes: (() => void)[] = [unsubscribeCategories];

        return () => {
            unsubscribes.forEach((unsub) => unsub());
        };
    }, [city]);

    const handleAddCategory = async () => {
        const name = categoryInput.trim();
        if (!name || categories.some((c) => c.name === name)) return;

        try {
            await createCategory(city, name);
            setCategoryInput('');
        } catch (err) {
            console.error('Failed to create category:', err);
        }
    };

    const handleAddPlaceToCategory = async (categoryName: string, placeDescription: string) => {
        try {
            await addItemToCategory(city, categoryName, placeDescription);
        } catch (err) {
            console.error('Failed to add item to category:', err);
        }
    };

    return (
        <div className="w-80 bg-white p-4 overflow-y-auto shadow-lg flex-shrink-0">
            <button onClick={onBack} className="mb-4 text-blue-500 hover:text-blue-700" title="Back">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <h1 className="text-xl font-bold mb-4">{city}</h1>

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

            {categories.map((cat) => (
                <div key={cat.name} className="mb-6">
                    <h2 className="font-semibold mb-2">{cat.name}</h2>

                    <ItemAutocomplete
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
