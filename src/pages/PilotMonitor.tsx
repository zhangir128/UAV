import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { fetchWeatherData } from "../services/weatherService";

// Fix for default marker icons in Leaflet with React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface DroneData {
  position: {
    lat: number;
    lng: number;
    altitude: number;
  };
  speed: number;
  heading: number;
  violations?: string[];
  weatherData?: {
    temperature: number;
    windSpeed: number;
    windDirection: number;
    visibility: number;
  };
  isFlying?: boolean;
}

// Mock data - replace with database data later
const mockDroneData: DroneData = {
  position: {
    lat: 55.7558,
    lng: 37.6173,
    altitude: 100,
  },
  speed: 15,
  heading: 45,
  violations: ["Превышение скорости"],
  weatherData: {
    temperature: 20,
    windSpeed: 5,
    windDirection: 180,
    visibility: 10,
  },
};

// Component to update map view when drone moves
const MapUpdater: React.FC<{ position: { lat: number; lng: number } }> = ({
  position,
}) => {
  const map = useMap();

  useEffect(() => {
    map.setView([position.lat, position.lng], map.getZoom());
  }, [position, map]);

  return null;
};

const PilotMonitor: React.FC = () => {
  const navigate = useNavigate();
  const [droneData, setDroneData] = useState<DroneData>(mockDroneData);
  const [startLocation, setStartLocation] = useState({ lat: "", lng: "" });
  const [targetLocation, setTargetLocation] = useState({
    lat: "",
    lng: "",
    altitude: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weather = await fetchWeatherData();
        setDroneData((prev) => ({
          ...prev,
          weatherData: weather,
        }));
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      }
    };

    // Initial fetch
    fetchData();

    // Set up refresh interval (every 5 minutes)
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleBackToPanel = () => {
    navigate("/pilot-panel");
  };

  const handleStartLocation = () => {
    if (startLocation.lat && startLocation.lng) {
      setDroneData((prev) => ({
        ...prev,
        position: {
          ...prev.position,
          lat: parseFloat(startLocation.lat),
          lng: parseFloat(startLocation.lng),
        },
      }));
    }
  };

  const handleMoveTo = () => {
    if (targetLocation.lat && targetLocation.lng && targetLocation.altitude) {
      setDroneData((prev) => ({
        ...prev,
        position: {
          lat: parseFloat(targetLocation.lat),
          lng: parseFloat(targetLocation.lng),
          altitude: parseFloat(targetLocation.altitude),
        },
      }));
    }
  };

  const handleTakeOff = () => {
    setDroneData((prev) => ({
      ...prev,
      isFlying: true,
    }));
  };

  const handleLand = () => {
    setDroneData((prev) => ({
      ...prev,
      isFlying: false,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            Мониторинг Полёта
          </h1>
          <button
            onClick={handleBackToPanel}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
          >
            Вернуться к Панели
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Drone Information Sidebar */}
          <div className="lg:col-span-1 bg-gray-800/50 rounded-xl backdrop-blur-sm p-4">
            <h2 className="text-xl font-semibold mb-4">Данные Дрона</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-700/50">
                <h3 className="font-medium mb-2">Позиция</h3>
                <div className="text-sm">
                  <p>Широта: {droneData.position.lat.toFixed(6)}°</p>
                  <p>Долгота: {droneData.position.lng.toFixed(6)}°</p>
                  <p>Высота: {droneData.position.altitude} м</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-700/50">
                <h3 className="font-medium mb-2">Параметры Полёта</h3>
                <div className="text-sm">
                  <p>Скорость: {droneData.speed} м/с</p>
                  <p>Курс: {droneData.heading}°</p>
                </div>
              </div>

              {droneData.weatherData && (
                <div className="p-4 rounded-lg bg-gray-700/50">
                  <h3 className="font-medium mb-2">Метеоданные</h3>
                  <div className="text-sm">
                    <p>Температура: {droneData.weatherData.temperature}°C</p>
                    <p>Скорость ветра: {droneData.weatherData.windSpeed} м/с</p>
                    <p>
                      Направление ветра: {droneData.weatherData.windDirection}°
                    </p>
                    <p>Видимость: {droneData.weatherData.visibility} км</p>
                  </div>
                </div>
              )}

              {droneData.violations && droneData.violations.length > 0 && (
                <div className="p-4 rounded-lg bg-red-900/30">
                  <h3 className="font-medium mb-2 text-red-400">Нарушения</h3>
                  <ul className="list-disc list-inside text-red-400 text-sm">
                    {droneData.violations.map((violation, index) => (
                      <li key={index}>{violation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Map Container */}
          <div className="lg:col-span-3 bg-gray-800/50 rounded-xl backdrop-blur-sm p-4">
            <div className="h-[600px] rounded-lg overflow-hidden">
              <MapContainer
                center={[droneData.position.lat, droneData.position.lng]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                  position={[droneData.position.lat, droneData.position.lng]}
                  icon={DefaultIcon}
                >
                  <Popup>
                    <div className="text-black">
                      <h3 className="font-bold">Позиция Дрона</h3>
                      <p>Высота: {droneData.position.altitude} м</p>
                      <p>Скорость: {droneData.speed} м/с</p>
                      <p>Курс: {droneData.heading}°</p>
                    </div>
                  </Popup>
                </Marker>
                <MapUpdater position={droneData.position} />
              </MapContainer>
            </div>

            {/* Control Panel */}
            <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Управление Дроном</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Начальная Позиция</h4>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Широта"
                        className="w-full p-2 rounded bg-gray-800 text-white"
                        value={startLocation.lat}
                        onChange={(e) =>
                          setStartLocation((prev) => ({
                            ...prev,
                            lat: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="number"
                        placeholder="Долгота"
                        className="w-full p-2 rounded bg-gray-800 text-white"
                        value={startLocation.lng}
                        onChange={(e) =>
                          setStartLocation((prev) => ({
                            ...prev,
                            lng: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <button
                      onClick={handleStartLocation}
                      className="mt-2 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300"
                    >
                      Установить Начальную Позицию
                    </button>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Конечная Позиция</h4>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Широта"
                        className="w-full p-2 rounded bg-gray-800 text-white"
                        value={targetLocation.lat}
                        onChange={(e) =>
                          setTargetLocation((prev) => ({
                            ...prev,
                            lat: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="number"
                        placeholder="Долгота"
                        className="w-full p-2 rounded bg-gray-800 text-white"
                        value={targetLocation.lng}
                        onChange={(e) =>
                          setTargetLocation((prev) => ({
                            ...prev,
                            lng: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="number"
                        placeholder="Высота"
                        className="w-full p-2 rounded bg-gray-800 text-white"
                        value={targetLocation.altitude}
                        onChange={(e) =>
                          setTargetLocation((prev) => ({
                            ...prev,
                            altitude: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <button
                      onClick={handleMoveTo}
                      className="mt-2 w-full px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition duration-300"
                    >
                      Установить Конечную Позицию
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Управление Полётом</h4>
                    <div className="flex gap-4">
                      <button
                        onClick={handleTakeOff}
                        disabled={droneData.isFlying}
                        className={`w-full px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                          droneData.isFlying
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        Взлёт
                      </button>
                      <button
                        onClick={handleLand}
                        disabled={!droneData.isFlying}
                        className={`w-full px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                          !droneData.isFlying
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        Посадка
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PilotMonitor;
