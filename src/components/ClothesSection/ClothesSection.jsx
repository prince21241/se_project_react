import "./ClothesSection.css";
import React, { useContext } from "react";
import { defaultClothingItems } from "../../utils/constants.js";
import ItemCard from "../ItemCard/ItemCard.jsx";
import { CurrentTemperatureUnitContext } from "../../contexts/CurrentTemperatureUnitContext";

function ClothesSection({
  onCardClick,
  clothingItems,
  weatherData,
  handleAddClick,
}) {
  const { currentTempUnit } = useContext(CurrentTemperatureUnitContext);
  return (
    <div className="clothes-section">
      <div className="section__header">
        <p>Your Items</p>
        <button onClick={handleAddClick} className="section__add-button">
          {" "}
          + Add item{" "}
        </button>
      </div>
      <ul className="clothes-section__list">
        {clothingItems.map((item) => {
          return (
            <ItemCard key={item._id} item={item} onCardClick={onCardClick} />
          );
        })}
      </ul>
    </div>
  );
}
export default ClothesSection;
