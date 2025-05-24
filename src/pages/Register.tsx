import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerApi } from "../api/auth"; // adjust path if needed

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check password match when either password field changes
    if (name === "password" || name === "confirmPassword") {
      if (name === "password" && formData.confirmPassword) {
        setPasswordError(
          value !== formData.confirmPassword ? "Пароли не совпадают" : ""
        );
      } else if (name === "confirmPassword" && formData.password) {
        setPasswordError(
          value !== formData.password ? "Пароли не совпадают" : ""
        );
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return;
    }

    try {
      const response = await registerApi({
        full_name:
          `${formData.firstName} ${formData.lastName} ${formData.middleName}`.trim(),
        email: formData.email,
        address: formData.address,
        phone: formData.phone,
        password: formData.password,
        role_id: 1, // 1 = User, 2 = Admin?
      });
      console.log(response);
      navigate("/login");
    } catch (err: unknown) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            Регистрация Пилота
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Фамилия
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Отчество
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

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
                  Номер Телефона
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Адрес
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Подтверждение Пароля
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-gray-700 border ${
                    passwordError ? "border-red-500" : "border-gray-600"
                  } rounded-lg focus:outline-none focus:border-blue-500`}
                  required
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
            >
              Зарегистрироваться
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
