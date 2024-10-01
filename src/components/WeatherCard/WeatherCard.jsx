import sunny from "../../assets/sunny.svg";
import "./WeatherCard.css";
import React, { useContext } from "react";
import { CurrentTemperatureUnitContext } from "../../contexts/CurrentTemperatureUnitContext";

function WeatherCard({ weatherData }) {
  // Use useContext to get the current temperature unit
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);

  return (
    <section className="weather-card">
      <p className="weather-card__temp">
        {weatherData.temp[currentTemperatureUnit]}
      </p>
      <img src={sunny} alt="Weather-Card" className="weather-card__image" />
    </section>
  );
}

export default WeatherCard;
