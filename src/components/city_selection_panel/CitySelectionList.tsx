interface Props {
    cities: string[];
    onCitySelect: (city: string) => void;
}

export function CityList({ cities, onCitySelect }: Props) {
    if (!cities.length) return null;

    return (
        <div className="mt-6 space-y-2">
            <h2 className="text-lg font-semibold">Added Cities</h2>
            {cities.map((city) => (
                <button
                    key={city}
                    onClick={() => onCitySelect(city)}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg w-full hover:bg-blue-200 text-left"
                >
                    {city}
                </button>
            ))}
        </div>
    );
}
