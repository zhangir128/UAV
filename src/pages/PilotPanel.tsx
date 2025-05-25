import React, { useState, useEffect } from "react";
import {
  activate_drone as activateDroneAPI,
  register_drone as registerDroneAPI,
  list_drones as ListDronesAPI,
} from "../api/drone";
import { useNavigate } from "react-router-dom";

// interface Drone {
//   id: number;
//   brand: string;
//   model: string;
//   serialNumber: string;
//   flightStatus?: "Ожидание" | "Одобрено" | "Отклонено";
// }
interface Drone {
  id: number;
  battery_level: number;
  created_at: string;
  current_altitude: number;
  current_lat: number;
  current_lng: number;
  current_status: "nullbattery" | "active" | "offline" | "stopped" | "flying";
  max_speed: number;
  name: string;
  owner_id: number;
  updated_at: string;
}

const map_flight_status = {
  nullbattery: "Разряжено",
  active: "Доступен",
  offline: "Оффлайн",
  stopped: "Остановлено",
  flying: "В полете",
};

interface FlightRequest {
  droneId: number;
  takeoffTime: string;
  altitude: number;
  startNorth: number;
  startEast: number;
  endNorth: number;
  endEast: number;
}

const PilotPanel: React.FC = () => {
  const navigate = useNavigate();
  const [drones, setDrones] = useState<Drone[]>([]);
  const [showAddDroneModal, setShowAddDroneModal] = useState(false);
  const [targetDrone, setTargetDrone] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [showFlightRequestModal, setShowFlightRequestModal] = useState(false);
  const [selectedDroneId, setSelectedDroneId] = useState<number>(0);
  console.log(selectedDroneId);
  const [newDrone, setNewDrone] = useState({
    name: "",
    max_speed: 0,
  });
  const [flightRequest, setFlightRequest] = useState<FlightRequest>({
    droneId: 0,
    takeoffTime: "",
    altitude: 0,
    startNorth: 0,
    startEast: 0,
    endNorth: 0,
    endEast: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ListDronesAPI();
        console.log(response);
        setDrones(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке запросов:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddDrone = async () => {
    setIsAdding(true);

    try {
      const response = await registerDroneAPI(
        newDrone.name,
        newDrone.max_speed
      );
      console.log(response);
      if (response.success) {
        setDrones([...drones, response.data]);
        setNewDrone({ name: "", max_speed: 0 });
        setShowAddDroneModal(false);
      }
    } catch (error) {
      console.log(error);
    }

    setIsAdding(false);
  };

  const handleFlightRequest = async () => {
    const response = await activateDroneAPI({
      drone_id: targetDrone,
      // departure_time: new Date(flightRequest.takeoffTime).toISOString(),
      altitude: flightRequest.altitude,
      lat: flightRequest.startNorth,
      lng: flightRequest.startEast,
      // end_lat: flightRequest.endNorth,
      // end_lng: flightRequest.endEast,
    });
    console.log(response);
    if (response.success) {
      setDrones(
        drones.map((drone) =>
          drone.id === targetDrone
            ? { ...drone, current_status: "active" }
            : drone
        )
      );
    }

    setShowFlightRequestModal(false);
    setTargetDrone(0);
  };

  const handleMonitorClick = (droneId: number) => {
    // TODO: Implement drone monitoring functionality
    console.log("Monitoring drone:", droneId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              Панель Пилота
            </h1>
            <button
              onClick={() => setShowAddDroneModal(true)}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
            >
              Добавить Дрона
            </button>
          </div>

          {/* Drones List */}
          <div className="bg-gray-800/50 rounded-xl backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Мои Дроны</h2>
            <div className="space-y-4">
              {drones.map((drone) => (
                <div
                  onClick={() => {
                    if (["active", "flying"].includes(drone.current_status)) {
                      navigate(`${drone.id}`);
                    } else if (drone.current_status === "offline") {
                      setShowFlightRequestModal(true);
                      setTargetDrone(drone.id);
                    }
                  }}
                  key={drone.id}
                  className="flex items-center justify-between bg-gray-700/50 p-4 rounded-lg w-full"
                >
                  <div>
                    <p className="font-medium">{drone.name}</p>
                    <p className="text-sm text-gray-400">
                      {drone.battery_level} %
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {drone.current_status && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          drone.current_status === "active" ||
                          drone.current_status === "flying"
                            ? "bg-green-500/20 text-green-400"
                            : drone.current_status === "nullbattery" ||
                              drone.current_status === "stopped"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {map_flight_status[drone.current_status]}
                      </span>
                    )}
                    {!drone.current_status && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          setSelectedDroneId(drone.id);
                          setFlightRequest({
                            ...flightRequest,
                            droneId: drone.id,
                          });
                          setShowFlightRequestModal(true);
                          setTargetDrone(drone.id);
                        }}
                        className="px-4 z-50 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition duration-300"
                      >
                        Запросить вылет
                      </button>
                    )}
                    {(drone.current_status === "active" ||
                      drone.current_status === "flying") && (
                      <button
                        onClick={() => handleMonitorClick(drone.id)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-medium transition duration-300"
                      >
                        Мониторинг
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {drones.length === 0 && (
                <p className="text-gray-400 text-center py-4">
                  У вас пока нет добавленных дронов
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Drone Modal */}
      {showAddDroneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Добавить Дрона</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Название
                </label>
                <input
                  type="text"
                  value={newDrone.name}
                  onChange={(e) =>
                    setNewDrone({ ...newDrone, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Максимальная скорость
                </label>
                <input
                  type="number"
                  value={newDrone.max_speed}
                  onChange={(e) =>
                    setNewDrone({
                      ...newDrone,
                      max_speed: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowAddDroneModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  Отмена
                </button>
                <button
                  disabled={isAdding}
                  onClick={handleAddDrone}
                  className={`px-4 py-2 rounded-lg text-white transition-colors duration-200 ${
                    isAdding
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flight Request Modal */}
      {showFlightRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Запрос на Вылет</h2>
            <div className="space-y-4">
              {/* <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Время вылета
                </label>
                <input
                  type="datetime-local"
                  value={flightRequest.takeoffTime}
                  onChange={(e) =>
                    setFlightRequest({
                      ...flightRequest,
                      takeoffTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Высота (м)
                </label>
                <input
                  type="number"
                  value={flightRequest.altitude}
                  onChange={(e) =>
                    setFlightRequest({
                      ...flightRequest,
                      altitude: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    North
                  </label>
                  <input
                    type="number"
                    value={flightRequest.startNorth}
                    onChange={(e) =>
                      setFlightRequest({
                        ...flightRequest,
                        startNorth: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    East
                  </label>
                  <input
                    type="number"
                    value={flightRequest.startEast}
                    onChange={(e) =>
                      setFlightRequest({
                        ...flightRequest,
                        startEast: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              {/* <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Финиш North
                  </label>
                  <input
                    type="number"
                    value={flightRequest.endNorth}
                    onChange={(e) =>
                      setFlightRequest({
                        ...flightRequest,
                        endNorth: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Финиш East
                  </label>
                  <input
                    type="number"
                    value={flightRequest.endEast}
                    onChange={(e) =>
                      setFlightRequest({
                        ...flightRequest,
                        endEast: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div> */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowFlightRequestModal(false);
                    setTargetDrone(0);
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  Отмена
                </button>
                <button
                  onClick={handleFlightRequest}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
                >
                  Запросить вылет
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PilotPanel;
