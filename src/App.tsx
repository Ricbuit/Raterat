import { useState } from 'react';
import MapView from './MapView';

function App() {
    const [city, setCity] = useState('');
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (city.trim() && !cities.includes(city.trim())) {
            setCities([...cities, city.trim()]);
            setCity('');
        }
    };

    return (
        <div className="h-screen w-screen flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 bg-white p-4 overflow-y-auto shadow-lg flex-shrink-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h1 className="text-xl font-bold">Add City</h1>
                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border rounded-lg p-2"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
                    >
                        Add
                    </button>
                </form>

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
                {selectedCity && <MapView city={selectedCity} />}
            </div>
        </div>
    );
}

export default App;
