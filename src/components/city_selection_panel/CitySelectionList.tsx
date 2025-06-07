interface Props {
    cities: string[];
    onCitySelect: (city: string) => void;
}

export function CityList({ cities, onCitySelect }: Props) {
    if (!cities.length) return null;

    return (
        <div className="city-list">
            <h2>Cities</h2>
            {cities.map((city) => (
                <button
                    key={city}
                    onClick={() => onCitySelect(city)}
                    className="btn btn-secondary city-button"
                >
                    {city}
                </button>
            ))}
        </div>
    );
}
