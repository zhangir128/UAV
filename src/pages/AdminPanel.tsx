import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  status: 'Ожидание' | 'Одобрено' | 'Отклонено';
  violations?: string[];
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [flightRequests, setFlightRequests] = useState<FlightRequest[]>([
    // Sample data for demonstration
    {
      id: '1',
      droneId: 'drone1',
      pilotName: 'Иван Петров',
      droneInfo: {
        brand: 'DJI',
        model: 'Mavic 3',
        serialNumber: 'SN123456'
      },
      takeoffTime: '2024-03-20T10:00',
      altitude: 100,
      startNorth: 55.7558,
      startEast: 37.6173,
      endNorth: 55.7517,
      endEast: 37.6178,
      status: 'Ожидание'
    },
    {
      id: '2',
      droneId: 'drone2',
      pilotName: 'Алексей Смирнов',
      droneInfo: {
        brand: 'Autel',
        model: 'EVO II',
        serialNumber: 'SN789012'
      },
      takeoffTime: '2024-03-20T11:00',
      altitude: 150,
      startNorth: 55.7528,
      startEast: 37.6175,
      endNorth: 55.7538,
      endEast: 37.6185,
      status: 'Одобрено',
      violations: ['Превышение скорости']
    }
  ]);

  const handleApproveFlight = (requestId: string) => {
    setFlightRequests(requests =>
      requests.map(request =>
        request.id === requestId
          ? { ...request, status: 'Одобрено' }
          : request
      )
    );
  };

  const handleRejectFlight = (requestId: string) => {
    setFlightRequests(requests =>
      requests.map(request =>
        request.id === requestId
          ? { ...request, status: 'Отклонено' }
          : request
      )
    );
  };

  const handleTerminateFlight = (requestId: string) => {
    setFlightRequests(requests =>
      requests.map(request =>
        request.id === requestId
          ? { ...request, status: 'Отклонено' }
          : request
      )
    );
  };

  const handleMonitorFlights = () => {
    navigate('/admin-monitor');
  };

  const pendingRequests = flightRequests.filter(request => request.status === 'Ожидание');
  const activeFlights = flightRequests.filter(request => request.status === 'Одобрено');

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
                  {pendingRequests.map(request => (
                    <tr key={request.id} className="border-b border-gray-700/50">
                      <td className="py-4">{request.pilotName}</td>
                      <td className="py-4">
                        {request.droneInfo.brand} {request.droneInfo.model}
                        <br />
                        <span className="text-sm text-gray-400">СН: {request.droneInfo.serialNumber}</span>
                      </td>
                      <td className="py-4">{new Date(request.takeoffTime).toLocaleString()}</td>
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
                      <td colSpan={6} className="py-4 text-center text-gray-400">
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
                  {activeFlights.map(flight => (
                    <tr key={flight.id} className="border-b border-gray-700/50">
                      <td className="py-4">{flight.pilotName}</td>
                      <td className="py-4">
                        {flight.droneInfo.brand} {flight.droneInfo.model}
                        <br />
                        <span className="text-sm text-gray-400">СН: {flight.droneInfo.serialNumber}</span>
                      </td>
                      <td className="py-4">{new Date(flight.takeoffTime).toLocaleString()}</td>
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
                      <td colSpan={7} className="py-4 text-center text-gray-400">
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
