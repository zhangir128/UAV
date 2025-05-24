import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginApi(formData.email, formData.password);

      // Save token, update context
      console.log(response);
      login(response.token, response.user.role_name, response.user.full_name); // role: 'police' | 'user'
      navigate(response.user.role_name === "police" ? "/admin" : "/home");
    } catch (err: unknown) {
      console.error("Ошибка входа. Проверьте почту и пароль.", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            Вход в Систему
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Почта
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Пароль
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
            >
              Войти
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-gray-400">
              Нет аккаунта?{" "}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300"
              >
                Зарегистрироваться
              </Link>
            </p>
            <p className="text-gray-400">
              <Link
                to="/forgot-password"
                className="text-blue-400 hover:text-blue-300"
              >
                Забыли пароль?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
