import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("Singapore");

  const fetchData = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/weather/?location=${encodeURIComponent(query)}&unit=celsius`);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const result = await res.json();
      setData(result?.data ?? null);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setData(null);
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and whenever searchQuery changes
  useEffect(() => {
    if (searchQuery.trim()) fetchData(searchQuery.trim());
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // We already have the controlled value in state; just ensure it's not empty
    const q = searchQuery.trim();
    if (!q) return;
    // Triggering setSearchQuery again is unnecessary; useEffect will have already run if it changed
    // If you want to force a refetch for the same value, call fetchData(q) here.
    fetchData(q);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title({ color: "blue" })}>Weather</h1>

          <div className="form-container">
            <form onSubmit={handleSubmit} className="my-6">
              <label htmlFor="location">Enter a country: </label>
              <br />
              <input
                id="location"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline text-center"
                name="location"
                type="text"
                value={searchQuery}
                onChange={handleChange}
                placeholder="e.g. Singapore"
              />
              <br />
              <Button color="primary" type="submit" variant="ghost" isDisabled={loading || !searchQuery.trim()}>
                {loading ? "Loading..." : "Submit"}
              </Button>
            </form>
          </div>

          {loading && (
            <div className="mt-4">
              <Spinner classNames={{ label: "text-foreground mt-4" }} label="Loading weather..." variant="wave" />
            </div>
          )}

          {!loading && error && (
            <p className="text-red-500 mt-4">{error}</p>
          )}

          {!loading && !error && data && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold">{data.country}</h2>
              <p>Temperature: {data.temperature} °C</p>
              <p>{data.region}</p>
            </div>
          )}

          {!loading && !error && !data && (
            <p className="mt-4 text-gray-500">No data yet. Try searching for a location.</p>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}
