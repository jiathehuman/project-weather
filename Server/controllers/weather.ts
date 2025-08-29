import axios from "axios";
import moment from "moment";
import { requireAPIKey } from "../utils/helpers";
import NodeCache from "node-cache";

const API_KEY = requireAPIKey();

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

const weather = axios.create({
  baseURL: "http://api.weatherapi.com/v1",
  timeout: 10000,
});

export const fetch_weather_data = async (location: string, unit: string) => {

  // Check cache
  const cacheKey = `${location.toLowerCase()}|celsius`;
  const hit = cache.get(cacheKey);
  if (hit)
    return {
      source: "cache",
      data: hit,
    };
  
  // No cache, get data from server
  const { data } = await weather.get("/current.json", {
    params: { key: API_KEY, q: location, aqi: "no" },
  });

  // Get formatted data
  const result = get_key_data(data, unit as "celsius" | "fahrenheit");
  // Set data in cache
  cache.set(cacheKey, result);
  return {
    data
  };
};

export const get_weather = async (req, res) => {
  const { location, unit } = req.query;
  try {
    const data = await fetch_weather_data(location.trim(), unit.trim());
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error });
  }
};

// Function to extract key data and format data
function get_key_data(data: any, unit: "celsius" | "fahrenheit") {
  const c = data?.current ?? {};
  const l = data?.location ?? {};
  const time = moment().format("YYYY-MM-DD HH:mm:ss");
  return {
    location: l.name,
    region: l.region,
    country: l.country,
    localtime: l.localtime ?? "",
    temperature: unit === "celsius" ? c.temp_c : c.temp_f,
    humidity: c.humidity ?? "",
    uv: c.uv ?? "",
    windspeed_kph: c.wind_kph ?? "",
    timestamp: time,
  };
}
