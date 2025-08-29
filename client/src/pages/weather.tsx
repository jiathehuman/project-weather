import React, {useState, useEffect} from "react";
import {Input} from "@heroui/input";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

interface WeatherData {
  location: string;
  region: string;
  country: string;
  localtime: string;
  temperature: number;
  humidity: number;
  timestamp: string;
  uv: number;
  windspeed_kph: number;
}

export default function WeatherPage() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [country, setCountry] = useState("Singapore");
  // const [value, setValue] = React.useState("");
  const [searchQuery, setSearchQuery] = useState("Singapore");
  
  const fetchData = () => {
    fetch(`/api/weather/?location=${searchQuery ?? "Singapore"}&unit=celsius`) // Use the proxy path
    .then((res) => res.json())
    .then((result) => {
      // console.log(result.data);
      setData(result.data)
    })
    .catch((err) => console.error("Fetch error:", err)); // Always add a catch block for error handling
  }
  useEffect(() => {
    fetchData()
  // fetch(`/api/weather/?location=${country}&unit=celsius`) // Use the proxy path
  //   .then((res) => res.json())
  //   .then((result) => {
  //     // console.log(result.data);
  //     setData(result.data)
  //   })
  //   .catch((err) => console.error("Fetch error:", err)); // Always add a catch block for error handling
}, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setCountry(searchQuery);
    fetchData()
  };

  const handleChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  // const handleSubmit = (e: any) => {
  //   e.preventDefault();
  //   setCountry(searchQuery);
  // };

  // const handleChange = (e: any) => {
  //   setSearchQuery(value);
  // };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Weather</h1>
                        <div className="form-container">
            <form onSubmit={handleSubmit}>
              <label>Enter a country: </label>
                    {/* <Input label="Search location" placeholder="Enter a country or city" 
                    value={value} onValueChange={handleChange} type="text" /> */}

              <input
                name="searchQuery"
                type="text"
                value={searchQuery || ""}
                onChange={handleChange}
              ></input>
              <button type="submit">Submit</button>
            </form>
        </div>
          <h2>Temperature: {data?.temperature}</h2>
          <p>{data?.country}</p>
          <p>{data?.region}</p>

          {/* <h2>{data.location}</h2>
          <p>Humidity: {data.humidity}</p>
         */}
        </div>
      </section>
    </DefaultLayout>
  );
}
