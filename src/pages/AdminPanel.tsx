import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  get_all as getFlightRequestsAPI,
  update_request as updateRequestStatusAPI,
} from "../api/drone";

interface FlightRequest {
  id: string;
  droneId: string;
  pilotName: string;
  droneInfo: {
    brand: string;
    model: string;
    serialNumber: string;
  };
  takeoffTime: string;
  altitude: number;
  startNorth: number;
  startEast: number;
  endNorth: number;
  endEast: number;
  status: "Ожидание" | "Одобрено" | "Отклонено";
  violations?: string[];
}

interface RawFlightRequest {
  id: number;
  drone_id: number;
  username: string;
  altitude: number;
  departure_time: string;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  state: "pending" | "approved" | "rejected" | string;
  // add other fields if needed
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [flightRequests, setFlightRequests] = useState<FlightRequest[]>([]);

  // 🔽 Fetch flight requests on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFlightRequestsAPI();
        console.log(response);
        setFlightRequests(
          response.data.map((item: RawFlightRequest) => ({
            id: item.id.toString(),
            droneId: item.drone_id.toString(),
            pilotName: item.username,
            droneInfo: {
              brand: "Unknown",
              model: "Unknown",
              serialNumber: "Unknown",
            },
            takeoffTime: item.departure_time,
            altitude: item.altitude,
            startNorth: item.start_lat,
            startEast: item.start_lng,
            endNorth: item.end_lat,
            endEast: item.end_lng,
            status:
              item.state === "pending"
                ? "Ожидание"
                : item.state === "approved"
                ? "Одобрено"
                : "Отклонено",
            violations: [],
          }))
        );
      } catch (error) {
        console.error("Ошибка при загрузке запросов:", error);
      }
    };

    fetchData();
  }, []);

  const handleApproveFlight = async (requestId: string) => {
    const response = await updateRequestStatusAPI(
      parseInt(requestId),
      "approved"
    );
    if (response.success == true) {
      setFlightRequests((requests) =>
        requests.map((request) =>
          request.id === requestId
            ? { ...request, status: "Одобрено" }
            : request
        )
      );
    }
  };

  const handleRejectFlight = async (requestId: string) => {
    const response = await updateRequestStatusAPI(
      parseInt(requestId),
      "approved"
    );
    if (response.success == true) {
      setFlightRequests((requests) =>
        requests.map((request) =>
          request.id === requestId
            ? { ...request, status: "Отклонено" }
            : request
        )
      );
    }
  };

  const handleTerminateFlight = (requestId: string) => {
    setFlightRequests((requests) =>
      requests.map((request) =>
        request.id === requestId ? { ...request, status: "Отклонено" } : request
      )
    );
  };

  const handleMonitorFlights = () => {
    navigate("/admin-monitor");
  };

  const pendingRequests = flightRequests.filter(
    (request) => request.status === "Ожидание"
  );
  const activeFlights = flightRequests.filter(
    (request) => request.status === "Одобрено"
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              Панель Администратора
            </h1>
            <button
              onClick={handleMonitorFlights}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
            >
              Мониторинг Полётов
            </button>
          </div>

          {/* Pending Flight Requests */}
          <div className="bg-gray-800/50 rounded-xl backdrop-blur-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Запросы на Полёты</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-3">Пилот</th>
                    <th className="pb-3">Дрон</th>
                    <th className="pb-3">Время вылета</th>
                    <th className="pb-3">Высота</th>
                    <th className="pb-3">Координаты</th>
                    <th className="pb-3">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-gray-700/50"
                    >
                      <td className="py-4">{request.pilotName}</td>
                      <td className="py-4">
                        {request.droneInfo.brand} {request.droneInfo.model}
                        <br />
                        <span className="text-sm text-gray-400">
                          СН: {request.droneInfo.serialNumber}
                        </span>
                      </td>
                      <td className="py-4">
                        {new Date(request.takeoffTime).toLocaleString()}
                      </td>
                      <td className="py-4">{request.altitude} м</td>
                      <td className="py-4">
                        Старт: {request.startNorth}, {request.startEast}
                        <br />
                        Финиш: {request.endNorth}, {request.endEast}
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveFlight(request.id)}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded-lg text-sm"
                          >
                            Одобрить
                          </button>
                          <button
                            onClick={() => handleRejectFlight(request.id)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-lg text-sm"
                          >
                            Отклонить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingRequests.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-4 text-center text-gray-400"
                      >
                        Нет ожидающих запросов
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Flights */}
          <div className="bg-gray-800/50 rounded-xl backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Активные Полёты</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-3">Пилот</th>
                    <th className="pb-3">Дрон</th>
                    <th className="pb-3">Время вылета</th>
                    <th className="pb-3">Высота</th>
                    <th className="pb-3">Координаты</th>
                    <th className="pb-3">Нарушения</th>
                    <th className="pb-3">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {activeFlights.map((flight) => (
                    <tr key={flight.id} className="border-b border-gray-700/50">
                      <td className="py-4">{flight.pilotName}</td>
                      <td className="py-4">
                        {flight.droneInfo.brand} {flight.droneInfo.model}
                        <br />
                        <span className="text-sm text-gray-400">
                          СН: {flight.droneInfo.serialNumber}
                        </span>
                      </td>
                      <td className="py-4">
                        {new Date(flight.takeoffTime).toLocaleString()}
                      </td>
                      <td className="py-4">{flight.altitude} м</td>
                      <td className="py-4">
                        Старт: {flight.startNorth}, {flight.startEast}
                        <br />
                        Финиш: {flight.endNorth}, {flight.endEast}
                      </td>
                      <td className="py-4">
                        {flight.violations ? (
                          <ul className="list-disc list-inside text-red-400">
                            {flight.violations.map((violation, index) => (
                              <li key={index}>{violation}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-green-400">Нет нарушений</span>
                        )}
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => handleTerminateFlight(flight.id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-lg text-sm"
                        >
                          Прекратить Полёт
                        </button>
                      </td>
                    </tr>
                  ))}
                  {activeFlights.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-4 text-center text-gray-400"
                      >
                        Нет активных полётов
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
