import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
// import ViewerMap from "../components/Drone3DMap";
// Fix for default marker icons in Leaflet with React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import type { RestrictedZone } from "../api/map";
import { create_zone, get_all_zones } from "../api/map";

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
      lat: 51.1655,
      lng: 71.4272,
      altitude: 100,
    },
    speed: 15,
    heading: 45,
    violations: ["Превышение скорости"],
  },
  // {
  //   id: "2",
  //   pilotName: "Алексей Смирнов",
  //   droneInfo: {
  //     brand: "Autel",
  //     model: "EVO II",
  //     serialNumber: "SN789012",
  //   },
  //   position: {
  //     lat: 55.7528,
  //     lng: 37.6175,
  //     altitude: 150,
  //   },
  //   speed: 10,
  //   heading: 90,
  // },
];

const AdminMonitor: React.FC = () => {
  const navigate = useNavigate();
  const [drones, setDrones] = useState<DronePosition[]>(mockDrones);
  const [selectedDrone, setSelectedDrone] = useState<DronePosition | null>(
    null
  );
  const [restrictedZones, setRestrictedZones] = useState<RestrictedZone[]>([]);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [newZone, setNewZone] = useState({
    name: "Оперный театр Астаны",
    radius: "500",
    latitude: "51.1694",
    longitude: "71.4491",
    altitude: "100",
    expires_at: "2024-12-31T23:59:59",
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
  }, []);

  const handleCreateZone = async () => {
    try {
      const createdZone = await create_zone({
        user_id: 1, // This should come from your auth system
        name: newZone.name,
        radius: Number(newZone.radius),
        latitude: Number(newZone.latitude),
        longitude: Number(newZone.longitude),
        altitude: Number(newZone.altitude),
        expires_at: newZone.expires_at + ":00Z",
        state: "active",
      });

      setRestrictedZones([...restrictedZones, createdZone]);
      setShowZoneModal(false);
      setNewZone({
        name: "",
        radius: "",
        latitude: "",
        longitude: "",
        altitude: "",
        expires_at: "",
      });
    } catch (error) {
      console.error("Error creating restricted zone:", error);
    }
  };

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
          <div className="flex gap-4">
            <button
              onClick={() => setShowZoneModal(true)}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
            >
              Добавить Запретную Зону
            </button>
            <button
              onClick={handleBackToPanel}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
            >
              Вернуться к Панели
            </button>
          </div>
        </div>

        {/* Zone Creation Modal */}
        {showZoneModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl w-96">
              <h2 className="text-xl font-bold mb-4">Создать Запретную Зону</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Введите название зоны"
                  className="w-full p-2 rounded bg-gray-700"
                  value={newZone.name}
                  onChange={(e) =>
                    setNewZone({ ...newZone, name: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Введите радиус в метрах"
                  className="w-full p-2 rounded bg-gray-700"
                  value={newZone.radius}
                  onChange={(e) =>
                    setNewZone({ ...newZone, radius: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Введите широту (например: 55.7558)"
                  className="w-full p-2 rounded bg-gray-700"
                  value={newZone.latitude}
                  onChange={(e) =>
                    setNewZone({ ...newZone, latitude: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Введите долготу (например: 37.6176)"
                  className="w-full p-2 rounded bg-gray-700"
                  value={newZone.longitude}
                  onChange={(e) =>
                    setNewZone({ ...newZone, longitude: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Введите высоту в метрах"
                  className="w-full p-2 rounded bg-gray-700"
                  value={newZone.altitude}
                  onChange={(e) =>
                    setNewZone({ ...newZone, altitude: e.target.value })
                  }
                />
                <input
                  type="datetime-local"
                  placeholder="Выберите дату и время окончания"
                  className="w-full p-2 rounded bg-gray-700"
                  value={newZone.expires_at}
                  onChange={(e) =>
                    setNewZone({ ...newZone, expires_at: e.target.value })
                  }
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowZoneModal(false)}
                    className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleCreateZone}
                    className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
                  >
                    Создать
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
          {/* <ViewerMap /> */}
          <div className="lg:col-span-3 bg-gray-800/50 rounded-xl backdrop-blur-sm p-4">
            <div className="h-[600px] rounded-lg overflow-hidden">
              <MapContainer
                center={[51.1694, 71.4491]}
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
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMonitor;
