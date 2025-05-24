import React from 'react';
import { Link } from 'react-router-dom';

const Welcome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            Система Управления БПЛА
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl">
            Продвинутая система управления беспилотным воздушным движением для безопасных и эффективных операций с дронами
          </p>
          
          {/* Auth Buttons */}
          <div className="flex gap-4 mb-16">
            <Link
              to="/register"
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
            >
              Регистрация
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-transparent border-2 border-blue-500 hover:bg-blue-500/10 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
            >
              Вход
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm">
            <div className="text-blue-400 text-2xl mb-4">🛸</div>
            <h3 className="text-xl font-semibold mb-2">Мониторинг Дронов</h3>
            <p className="text-gray-400">Отслеживание и мониторинг операций с дронами в реальном времени с продвинутой визуализацией.</p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm">
            <div className="text-blue-400 text-2xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">Запросы на Полеты</h3>
            <p className="text-gray-400">Оптимизированный процесс подачи и управления запросами на полеты для пилотов.</p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm">
            <div className="text-blue-400 text-2xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold mb-2">Интерактивные Карты</h3>
            <p className="text-gray-400">Живая визуализация движения дронов и управления воздушным пространством.</p>
          </div>
        </div>

        {/* About UTM Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Что такое УВД?</h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Система Управления Воздушным Движением (УВД) - это комплексная платформа, разработанная для обеспечения безопасных и эффективных операций с дронами. 
            Она предоставляет возможности мониторинга в реальном времени, планирования полетов и управления воздушным пространством как для пилотов, так и для администраторов.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
