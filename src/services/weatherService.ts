import axios from 'axios';

const API_KEY = 'd1cb55a1d55f41b4ae185839252505';
const ASTANA_LAT = 51.1694;
const ASTANA_LON = 71.4491;

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
}

export const fetchWeatherData = async (): Promise<WeatherData> => {
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${ASTANA_LAT},${ASTANA_LON}&aqi=no`
    );

    const data = response.data;
    return {
      temperature: data.current.temp_c,
      windSpeed: data.current.wind_kph / 3.6, // Convert km/h to m/s
      windDirection: data.current.wind_degree,
      visibility: data.current.vis_km,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}; 