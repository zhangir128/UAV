import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { fetchWeatherData } from "../services/weatherService";
import { useParams } from "react-router-dom";
import {
  drone_status as getDroneStateAPI,
  start_position as setStartLocationAPI,
  end_position as setEndLocationAPI,
} from "../api/drone";
import type { RestrictedZone } from "../api/map";
import { get_all_zones } from "../api/map";
// Fix for default marker icons in Leaflet with React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface DroneData {
  latitude: number;
  longitude: number;
  altitude: number;

  speed: number;
  battery: number;
  is_flying: boolean;
  moving_to_target: boolean;
  violations?: string[];
  weatherData?: {
    temperature: number;
    windSpeed: number;
    windDirection: number;
    visibility: number;
  };
}

// Mock data - replace with database data later
const mockDroneData: DroneData = {
  latitude: 51.1694,
  longitude: 71.4491,
  altitude: 100,
  speed: 15,
  is_flying: true,
  moving_to_target: false,
  battery: 45,
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
  const { droneId } = useParams<{ droneId: string }>();
  console.log("DRON", droneId);
  const navigate = useNavigate();
  const [droneData, setDroneData] = useState<DroneData>(mockDroneData);
  const [restrictedZones, setRestrictedZones] = useState<RestrictedZone[]>([]);
  const [startLocation, setStartLocation] = useState({ lat: "", lng: "" });
  const [targetLocation, setTargetLocation] = useState({
    lat: "",
    lng: "",
    altitude: "",
  });

  // Fetch restricted zones
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const data = await get_all_zones();
        setRestrictedZones(data);
      } catch (error) {
        console.error("Error fetching restricted zones:", error);
      }
    };

    fetchZones();
    // Refresh zones every minute
    const intervalId = setInterval(fetchZones, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!droneId) return;

        const [droneStatus, weather] = await Promise.all([
          getDroneStateAPI(parseInt(droneId)),
          fetchWeatherData(),
        ]);
        console.log(droneStatus);

        setDroneData({
          ...droneStatus.status,
          weatherData: weather,
        });
      } catch (error) {
        console.error("Failed to fetch drone or weather data:", error);
      }
    };

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 60 * 1000); // Every 60 seconds

    return () => clearInterval(intervalId); // Cleanup
  }, [droneId]);

  const handleBackToPanel = () => {
    navigate("/home");
  };

  const handleStartLocation = async () => {
    if (startLocation.lat && startLocation.lng && droneId) {
      const response = await setStartLocationAPI(
        droneId,
        parseInt(startLocation.lat),
        parseInt(startLocation.lng),
        10
      );
      if (response.status == "move command sent") {
        setDroneData((prev) => ({
          ...prev,
          latitude: parseFloat(startLocation.lat),
          longitude: parseFloat(startLocation.lng),
        }));
      }
    }
  };

  const handleMoveTo = async () => {
    if (
      targetLocation.lat &&
      targetLocation.lng &&
      targetLocation.altitude &&
      droneId
    ) {
      const response = await setEndLocationAPI(
        droneId,
        parseInt(targetLocation.lat),
        parseInt(targetLocation.lng),
        parseInt(targetLocation.altitude)
      );
      console.log(response);
      if (response.status == "move command sent") {
        setDroneData((prev) => ({
          ...prev,

          latitude: parseFloat(targetLocation.lat),
          longitude: parseFloat(targetLocation.lng),
          altitude: parseFloat(targetLocation.altitude),
        }));
      }
    }
  };

  const handleTakeOff = () => {
    setDroneData((prev) => ({
      ...prev,
      is_flying: true,
    }));
  };

  const handleLand = () => {
    setDroneData((prev) => ({
      ...prev,
      is_flying: false,
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

        {droneData && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Drone Information Sidebar */}
            <div className="lg:col-span-1 bg-gray-800/50 rounded-xl backdrop-blur-sm p-4">
              <h2 className="text-xl font-semibold mb-4">Данные Дрона</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-700/50">
                  <h3 className="font-medium mb-2">Позиция</h3>
                  {droneData && (
                    <div className="text-sm">
                      <p>Широта: {droneData.latitude}°</p>
                      <p>Долгота: {droneData.longitude}°</p>
                      <p>Высота: {droneData.altitude} м</p>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-lg bg-gray-700/50">
                  <h3 className="font-medium mb-2">Параметры Полёта</h3>
                  <div className="text-sm">
                    <p>Скорость: {droneData.speed} м/с</p>
                    <p>Курс: {droneData.moving_to_target}°</p>
                  </div>
                </div>

                {droneData.weatherData && (
                  <div className="p-4 rounded-lg bg-gray-700/50">
                    <h3 className="font-medium mb-2">Метеоданные</h3>
                    <div className="text-sm">
                      <p>Температура: {droneData.weatherData.temperature}°C</p>
                      <p>
                        Скорость ветра: {droneData.weatherData.windSpeed} м/с
                      </p>
                      <p>
                        Направление ветра: {droneData.weatherData.windDirection}
                        °
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
                  center={[51.1694, 71.4491]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[droneData.latitude, droneData.longitude]}
                    icon={DefaultIcon}
                  >
                    <Popup>
                      <div className="text-black">
                        <h3 className="font-bold">Позиция Дрона</h3>
                        <p>Высота: {droneData.altitude} м</p>
                        <p>Скорость: {droneData.speed} м/с</p>
                        <p>Курс: {droneData.moving_to_target}°</p>
                      </div>
                    </Popup>
                  </Marker>
                  {restrictedZones.map((zone) => (
                    <Circle
                      key={zone.id}
                      center={[zone.latitude, zone.longitude]}
                      radius={zone.radius}
                      pathOptions={{
                        color: "red",
                        fillColor: "red",
                        fillOpacity: 0.3,
                      }}
                    >
                      <Popup>
                        <div className="text-black">
                          <h3 className="font-bold">{zone.name}</h3>
                          <p>Радиус: {zone.radius} м</p>
                          <p>Высота: {zone.altitude} м</p>
                          <p>Статус: {zone.state}</p>
                          <p>
                            Действует до:{" "}
                            {new Date(zone.expires_at).toLocaleString()}
                          </p>
                        </div>
                      </Popup>
                    </Circle>
                  ))}
                  <MapUpdater
                    position={{
                      lat: droneData.latitude,
                      lng: droneData.longitude,
                    }}
                  />
                </MapContainer>
              </div>

              {/* Control Panel */}
              <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Управление Дроном
                </h3>
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
                          disabled={droneData.is_flying}
                          className={`w-full px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                            droneData.is_flying
                              ? "bg-gray-500 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          Взлёт
                        </button>
                        <button
                          onClick={handleLand}
                          disabled={!droneData.is_flying}
                          className={`w-full px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                            !droneData.is_flying
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
        )}
      </div>
    </div>
  );
};

export default PilotMonitor;
