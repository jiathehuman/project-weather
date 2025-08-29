# Project weather

## Authentication 
### Register
- Register for a new user
POST http://localhost:3000/auth/register

{
    "username": "joedoe",
    "email": "joedoe@gmail.com",
    "password": "Asdfghjk123!"
}

- Login for the new user
POST http://localhost:3000/auth/login

{
    "username": "joedoe",
    "password": "Asdfghjk123!",
    "repeat_password": "Asdfghjk123!"
}

Retrieve the JWT token and use it to test:
GET http://localhost:3000/auth/test

## Preferences
- Retrieve preferences (Route requires token)
GET http://localhost:3000/preferences
Successful response:
{
    "data": {
        "id": "162d5bea-0978-4d5c-9d14-59c2fb4fb60e",
        "city": "Singapore",
        "country_code": "SG",
        "temperature_unit": "fahrenheit",
        "createdAt": "2025-08-28T07:50:55.000Z",
        "updatedAt": "2025-08-28T07:51:19.000Z"
    }
}

- Create or update a user's preferences (Route requires token)
POST http://localhost:3000/preferences
Successful response
{
    "data": {
        "id": "162d5bea-0978-4d5c-9d14-59c2fb4fb60e",
        "city": "Singapore",
        "country_code": "SG",
        "temperature_unit": "fahrenheit",
        "createdAt": "2025-08-28T07:50:55.000Z",
        "updatedAt": "2025-08-28T07:51:19.000Z"
    }
}

## Weather
I chose WeatherAPI because it has an Interactive API Explorer that lets me play around with it.

Currently there is one route
GET http://localhost:3000/weather/:location

Examples:
http://localhost:3000/weather/london
http://localhost:3000/weather/1.3521,103.8198

**Raw API response**
{
    "location": {
        "name": "London",
        "region": "City of London, Greater London",
        "country": "United Kingdom",
        "lat": 51.5171,
        "lon": -0.1062,
        "tz_id": "Europe/London",
        "localtime_epoch": 1756370233,
        "localtime": "2025-08-28 09:37"
    },
    "current": {
        "last_updated_epoch": 1756369800,
        "last_updated": "2025-08-28 09:30",
        "temp_c": 18.3,
        "temp_f": 64.9,
        "is_day": 1,
        "condition": {
            "text": "Partly Cloudy",
            "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
            "code": 1003
        },
        "wind_mph": 10.3,
        "wind_kph": 16.6,
        "wind_degree": 218,
        "wind_dir": "SW",
        "pressure_mb": 1003.0,
        "pressure_in": 29.62,
        "precip_mm": 0.0,
        "precip_in": 0.0,
        "humidity": 68,
        "cloud": 25,
        "feelslike_c": 18.3,
        "feelslike_f": 64.9,
        "windchill_c": 18.7,
        "windchill_f": 65.7,
        "heatindex_c": 18.7,
        "heatindex_f": 65.7,
        "dewpoint_c": 10.5,
        "dewpoint_f": 50.9,
        "vis_km": 10.0,
        "vis_miles": 6.0,
        "uv": 1.3,
        "gust_mph": 11.8,
        "gust_kph": 19.0
    }
}

**Transformed response**
{
    "source": "cache",
    "data": {
        "location": "Beijing",
        "region": "Beijing",
        "country": "China",
        "localtime": "2025-08-28 17:02",
        "temperature": 27.1,
        "humidity": 70,
        "uv": 0.6,
        "windspeed": 5
    },
    "message": "Successfully retrieved data"
}