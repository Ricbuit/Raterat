import { useEffect } from 'react';
import { fetchCities, saveCity } from '../../services/Firestore';
import { CityInput } from './CitySelectionInput';
import { CityList } from './CitySelectionList';
import './CitySelectionPanel.css';

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

    const handleSelect = async (cityList: string) => {
        const cityName = parseCityName(cityList);
        if (cities.some(c => c.toLowerCase() === cityName.toLowerCase())) return;

        try {
            await saveCity(cityName);
            setCities([...cities, cityName]);
        } catch (err) {
            console.error('Failed to save city:', err);
        }
    };

    const parseCityName = (cityList: string) => {
        const parts = cityList.split(',');
        return parts.length > 0 ? parts[0].trim() : cityList;
    };

    return (
        <div className="city-panel">
            <h1>Add City</h1>
            <CityInput onSelect={handleSelect} />
            <CityList cities={cities} onCitySelect={onCitySelect} />
        </div>
    );
}
