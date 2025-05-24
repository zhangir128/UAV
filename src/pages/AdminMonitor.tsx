import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

// Fix for default marker icons in Leaflet with React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface DronePosition {
  id: string;
  pilotName: string;
  droneInfo: {
    brand: string;
    model: string;
    serialNumber: string;
  };
  position: {
    lat: number;
    lng: number;
    altitude: number;
  };
  speed: number;
  heading: number;
  violations?: string[];
}

// Mock data - replace with database data later
const mockDrones: DronePosition[] = [
  {
    id: "1",
    pilotName: "Иван Петров",
    droneInfo: {
      brand: "DJI",
      model: "Mavic 3",
      serialNumber: "SN123456",
    },
    position: {
      lat: 55.7558,
      lng: 37.6173,
      altitude: 100,
    },
    speed: 15,
    heading: 45,
    violations: ["Превышение скорости"],
  },
  {
    id: "2",
    pilotName: "Алексей Смирнов",
    droneInfo: {
      brand: "Autel",
      model: "EVO II",
      serialNumber: "SN789012",
    },
    position: {
      lat: 55.7528,
      lng: 37.6175,
      altitude: 150,
    },
    speed: 10,
    heading: 90,
  },
];

// Component to update map view when drones move
const MapUpdater: React.FC<{ drones: DronePosition[] }> = ({ drones }) => {
  const map = useMap();

  useEffect(() => {
    if (drones.length > 0) {
      const bounds = drones.map((drone) => [
        drone.position.lat,
        drone.position.lng,
      ]);
      map.fitBounds(bounds as any);
    }
  }, [drones, map]);

  return null;
};

const AdminMonitor: React.FC = () => {
  const navigate = useNavigate();
  const [drones, setDrones] = useState<DronePosition[]>(mockDrones);
  const [selectedDrone, setSelectedDrone] = useState<DronePosition | null>(
    null
  );

  // Simulate drone movement - replace with real data updates later
  useEffect(() => {
    const interval = setInterval(() => {
      setDrones((currentDrones) =>
        currentDrones.map((drone) => ({
          ...drone,
          position: {
            ...drone.position,
            lat: drone.position.lat + (Math.random() - 0.5) * 0.001,
            lng: drone.position.lng + (Math.random() - 0.5) * 0.001,
          },
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleBackToPanel = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            Мониторинг Полётов
          </h1>
          <button
            onClick={handleBackToPanel}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
          >
            Вернуться к Панели
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Drone List Sidebar */}
          <div className="lg:col-span-1 bg-gray-800/50 rounded-xl backdrop-blur-sm p-4">
            <h2 className="text-xl font-semibold mb-4">Активные Дроны</h2>
            <div className="space-y-4">
              {drones.map((drone) => (
                <div
                  key={drone.id}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedDrone?.id === drone.id
                      ? "bg-blue-500/20 border border-blue-500"
                      : "bg-gray-700/50 hover:bg-gray-700/70"
                  }`}
                  onClick={() => setSelectedDrone(drone)}
                >
                  <h3 className="font-medium">{drone.pilotName}</h3>
                  <p className="text-sm text-gray-400">
                    {drone.droneInfo.brand} {drone.droneInfo.model}
                  </p>
                  <div className="mt-2 text-sm">
                    <p>Высота: {drone.position.altitude} м</p>
                    <p>Скорость: {drone.speed} м/с</p>
                    <p>Курс: {drone.heading}°</p>
                  </div>
                  {drone.violations && (
                    <div className="mt-2">
                      <p className="text-red-400 text-sm">Нарушения:</p>
                      <ul className="list-disc list-inside text-red-400 text-sm">
                        {drone.violations.map((violation, index) => (
                          <li key={index}>{violation}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Map Container */}
          <div className="lg:col-span-3 bg-gray-800/50 rounded-xl backdrop-blur-sm p-4">
            <div className="h-[600px] rounded-lg overflow-hidden">
              <MapContainer
                center={[55.7558, 37.6173]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {drones.map((drone) => (
                  <Marker
                    key={drone.id}
                    position={[drone.position.lat, drone.position.lng]}
                    icon={DefaultIcon}
                  >
                    <Popup>
                      <div className="text-black">
                        <h3 className="font-bold">{drone.pilotName}</h3>
                        <p>
                          {drone.droneInfo.brand} {drone.droneInfo.model}
                        </p>
                        <p>Высота: {drone.position.altitude} м</p>
                        <p>Скорость: {drone.speed} м/с</p>
                        <p>Курс: {drone.heading}°</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                <MapUpdater drones={drones} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMonitor;
