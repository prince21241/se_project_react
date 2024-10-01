import { CurrentTemperatureUnitContext } from "../../contexts/CurrentTemperatureUnitContext";
import WeatherCard from "../WeatherCard/WeatherCard";
import { defaultClothingItems } from "../../utils/constants";
import Itemcard from "../ItemCard/ItemCard";
import "./Main.css";

function Main({ weatherData, handleCardClick }) {
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);
  console.log(weatherData);
  return (
    <main>
      <WeatherCard weatherData={weatherData} />
      <section className="cards">
        <p className="cards__text">
          Today is {weatherData.temp[currentTemperatureUnit]} &deg; F / You may
          want to wear:
        </p>
        <ul className="cards__list">
          {" "}
          {defaultClothingItems
            .filter((item) => {
              return item.weather === weatherData.type;
            })
            .map((item) => {
              return (
                <Itemcard
                  key={item._id}
                  item={item}
                  onCardClick={handleCardClick}
                />
              );
            })}
        </ul>
      </section>
    </main>
  );
}

export default Main;
