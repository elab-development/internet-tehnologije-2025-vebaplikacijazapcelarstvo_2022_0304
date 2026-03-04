"use client";
import { useEffect, useState } from "react";

interface WeatherData {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
}

function getWeatherDescription(code: number): string {
  if (code === 0) return "Vedro ☀️";
  if (code <= 3) return "Delimično oblačno ⛅";
  if (code <= 48) return "Magla 🌫️";
  if (code <= 67) return "Kiša 🌧️";
  if (code <= 77) return "Sneg 🌨️";
  if (code <= 82) return "Pljuskovi 🌦️";
  if (code <= 99) return "Grmljavina ⛈️";
  return "Nepoznato";
}

export default function WeatherComponent({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
      });
  }, [latitude, longitude]);

  if (loading)
    return <p className="text-sm text-gray-400">Učitavanje prognoze...</p>;
  if (!weather)
    return (
      <p className="text-sm text-gray-400">Nije moguće učitati prognozu.</p>
    );

  const { temperature, windspeed, weathercode } = weather.current_weather;

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-100 dark:border-blue-800 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Temperatura
        </p>
        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
          {temperature}°C
        </p>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-100 dark:border-blue-800 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vetar</p>
        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
          {windspeed} km/h
        </p>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-100 dark:border-blue-800 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Stanje</p>
        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
          {getWeatherDescription(weathercode)}
        </p>
      </div>
    </div>
  );
}
