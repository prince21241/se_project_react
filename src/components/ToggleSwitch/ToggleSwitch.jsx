import { useContext, useState } from "react";
import "./ToggleSwitch.css";
import { CurrentTemperatureUnitContext } from "../../contexts/CurrentTemperatureUnitContext";

function Toggleswitch() {
  // const [currentTempratureUnit, handleToggleSwitchChange] = useState("C");
  //  const handleChange = (e) => {
  //    if (currentTempratureUnit === "C") handleToggleSwitchChange("F");
  //    if (currentTempratureUnit === "F") handleToggleSwitchChange("C");
  //  };
  //  console.log(currentTempratureUnit);

  const { currentTempratureUnit, handleToggleSwitchChange } = useContext(
    CurrentTemperatureUnitContext
  );

  return (
    <label className="switch">
      <input
        type="checkbox"
        className="switch__box"
        onChange={handleToggleSwitchChange}
      />
      <span
        className={
          currentTempratureUnit === "F"
            ? "switch__slider switch__slider-F"
            : "switch__slider switch__slider-C"
        }
      ></span>
      <p
        className={`switch__temp-F ${
          currentTempratureUnit === "F" && "switch__active"
        }`}
      >
        F
      </p>
      <p
        className={`switch__temp-C ${
          currentTempratureUnit === "C" && "switch__active"
        }`}
      >
        C
      </p>
    </label>
  );
}

export default Toggleswitch;
