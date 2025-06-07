import { useEffect } from 'react';
import { fetchCities, saveCity } from '../../services/Firestore';
import { CityInput } from './CitySelectionInput';
import { CityList } from './CitySelectionList';

interface Props {
    onCitySelect: (city: string) => void;
    cities: string[];
    setCities: (cities: string[]) => void;
}

export default function CitySelectionPanel({ onCitySelect, cities, setCities }: Props) {
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

    const handleSelect = async (description: string) => {
        const cityName = parseCityName(description);
        if (cities.some(c => c.toLowerCase() === cityName.toLowerCase())) return;

        try {
            await saveCity(cityName);
            setCities([...cities, cityName]);
        } catch (err) {
            console.error('Failed to save city:', err);
        }
    };

    const parseCityName = (description: string) => {
        const parts = description.split(',');
        return parts.length > 0 ? parts[0].trim() : description;
    };

    return (
        <div className="w-80 bg-white p-4 overflow-y-auto shadow-lg flex-shrink-0">
            <h1 className="text-xl font-bold mb-4">Add City</h1>
            <CityInput onSelect={handleSelect} />
            <CityList cities={cities} onCitySelect={onCitySelect} />
        </div>
    );
}
