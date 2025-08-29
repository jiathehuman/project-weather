import axios from "axios";
import NodeCache from "node-cache";
import { requireAPIKey } from "../utils/helpers";
import { preferenceRepository } from "./preference";
import { userRepository } from "./users";
import moment from "moment";
import { fetch_weather_data } from "./weather";

const API_KEY = requireAPIKey();

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

const weather = axios.create({
  baseURL: "http://api.weatherapi.com/v1",
  timeout: 5000,
});

export const get_weather_from_preferences = async (req, res) => {
  const { q } = req.query;
  console.log(q)
  try {
    // const user = req?.currentUser
    const userId = req?.currentUser?.id;
    const user = await userRepository.findOne({
      where: { id: userId },
    });
    delete user.password;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const pref = await preferenceRepository.findOne({
      where: [
        { user: { id: userId }, city: q },
        { user: { id: userId }, country_code: q },
      ],
    });
    
    if (!pref)
      return res
        .status(400)
        .json({
          error: "No preference",
          message: "Please set your preferences first",
        });
    if (!pref.city)
      return res
        .status(400)
        .json({
          error: "No city set",
          message: "Please set a city in your preferences",
        });

    const location = pref.city.trim();
    const unit = pref.temperature_unit.toLowerCase().trim();
    const data = await fetch_weather_data(location, unit);
    return res.status(200).json({ source: "server", data: data, pref: pref, user: user });
  } catch (err) {
    const status = (axios.isAxiosError(err) && err.response?.status) || 502;
    return res.status(status).json({
      error: "Failed to fetch weather",
      message: axios.isAxiosError(err) ? err.message : String(err),
    });
  }
};

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

// import { requireAPIKey } from "../utils/helpers";
// import { preferenceRepository } from "./preference";
// import NodeCache from "node-cache";
// import { get_weather } from "./weather";

// const API_KEY = requireAPIKey();

// const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
// const key = "weather";

// export const get_weather_from_preferences = async (req, res) => {
//   const currentUser = req.currentUser;
//   if (!currentUser?.id)
//     // if no id, they have no valid token
//     return res.status(401).json({ error: "Unauthorized" });
//   const pref = await preferenceRepository.findOne({
//     where: { user: { id: currentUser.id } },
//   });
//   // if no preference, send an empty array
//   if (!pref)
//     return res
//       .status(400)
//       .json({
//         error: "No preference",
//         message: "Please set your preferences first",
//       });
//   if (!pref.city)
//     return res
//       .status(400)
//       .json({
//         error: "No city set",
//         message: "Please set a city in your preferences",
//       });

//   const location = pref.city
//   const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${
//     location || "Singapore"
//   }&aqi=no`;

//   const cachedData = cache.get(location);
//   if (cachedData)
//     return res
//       .status(200)
//       .json({
//         source: "cache",
//         data: cachedData,
//         message: "Successfully retrieved data",
//       });

//   fetch(url)
//     .then((res) => res.json())
//     .then((data) => {
//       const key_data = retreve_key_data(data, pref.temperature_unit);
//       cache.set(location, key_data);
//       res
//         .status(200)
//         .json({
//           source: "server",
//           data: key_data,
//           pref: pref,
//           message: "Successfully retrieved data",
//         });
//     })
//     .catch((err) => {
//       res.status(404).json({ error: `${err}` });
//     });
// };

// const retreve_key_data = (data, preference) => {
// const temp = (preference=="celsius" ? data.current.temp_c : data.current.temp_f)
//   return {
//     location: data.location.name,
//     region: data.location.region,
//     country: data.location.country,
//     localtime: data.location.localtime ?? "",
//     temperature: temp ?? "",
//     humidity: data.current.humidity ?? "",
//     uv: data.current.uv ?? "",
//     windspeed: data.current.wind_kph ?? "",
//   };
// };
