import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

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

  // Simulate drone movement - replace with real data updates later
  useEffect(() => {
    const interval = setInterval(() => {
      setDroneData((currentData) => ({
        ...currentData,
        position: {
          ...currentData.position,
          lat: currentData.position.lat + (Math.random() - 0.5) * 0.001,
          lng: currentData.position.lng + (Math.random() - 0.5) * 0.001,
        },
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleBackToPanel = () => {
    navigate("/pilot-panel");
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PilotMonitor;
