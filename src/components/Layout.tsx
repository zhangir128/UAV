// src/components/Layout.tsx
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { isAuthenticated, name, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="w-full px-6 py-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm flex justify-between items-center sticky top-0 z-50">
        <Link to="/">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400 hover:opacity-90 transition duration-200">
            UAV Platform
          </h1>
        </Link>
        <nav className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-white px-4 py-2 rounded hover:bg-blue-500/10 border border-blue-500 transition"
              >
                Вход
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
              >
                Регистрация
              </Link>
            </>
          ) : (
            <>
              <p>
                <span className="font-medium">Добро пожаловать, </span>
                <span className="text-blue-400 font-medium">
                  {name?.split(" ")[0]}
                </span>
              </p>
              <button
                onClick={handleLogout}
                className="bg-red-400 hover:bg-red-700 text-white px-4 py-2 rounded transition cursor-pointer"
              >
                Выйти
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
