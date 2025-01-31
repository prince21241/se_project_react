import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { coordinates, APIkey } from "../../utils/constants";

import Header from "../Header/Header";
import Main from "../Main/Main";
import ItemModal from "../ItemModal/ItemModal";
import Profile from "../Profile/Profile";
import Footer from "../Footer/Footer";

import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import { CurrentTemperatureUnitContext } from "../../contexts/CurrentTemperatureUnitContext";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import AddItemModal from "../AddItemModal/AddItemModal";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { getItems, deleteItem, postItem, updateUser } from "../../utils/api";
import { signin, signup, checkToken } from "../../utils/auth";
import { addCardLike, removeCardLike } from "../../utils/api";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal";

function App() {
  // User authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Weather and clothing data state
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999 },
    city: "",
  });
  const [clothingItems, setClothingItems] = useState([]);

  // Modal state
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  // Temperature unit toggle
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit((prevUnit) => (prevUnit === "F" ? "C" : "F"));
  };

  // Modal handlers
  const openModal = (modalType, card = null) => {
    setSelectedCard(card);
    setActiveModal(modalType);
  };

  const closeActiveModal = () => setActiveModal("");

  // Add new item
  const handleAddItemSubmit = (item) => {
    const token = localStorage.getItem("jwt");
    if (!token) return alert("You must be logged in to add items.");

    postItem(
      {
        name: item.name,
        imageUrl: item.link,
        weather: item.weather.toLowerCase(),
      },
      token
    )
      .then((savedItem) => setClothingItems([savedItem.data, ...clothingItems]))
      .catch(console.error)
      .finally(closeActiveModal);
  };

  // Delete item
  const handleDeleteItem = (item) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    deleteItem(item._id, token)
      .then(() =>
        setClothingItems((prev) => prev.filter((i) => i._id !== item._id))
      )
      .catch(console.error)
      .finally(closeActiveModal);
  };

  // User authentication handlers
  const handleUserRegister = (userData) => {
    signup(userData)
      .then(() =>
        signin({ email: userData.email, password: userData.password })
      )
      .then((loginRes) => {
        localStorage.setItem("jwt", loginRes.token);
        setIsLoggedIn(true);
        closeActiveModal();
      })
      .catch(() => alert("Registration or login failed. Please try again."));
  };

  const handleUserLogin = ({ email, password }) => {
    signin({ email, password })
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setIsLoggedIn(true);
        setCurrentUser(res.user);
        closeActiveModal();
      })
      .catch(() => alert("Login failed. Please check your credentials."));
  };

  const handleCardLike = (item) => {
    const token = localStorage.getItem("jwt");
    if (!token) return alert("You must be logged in to like items.");

    const isLiked = item.likes.includes(currentUser?._id);
    const likeRequest = isLiked
      ? removeCardLike(item._id, token)
      : addCardLike(item._id, token);

    likeRequest
      .then((updatedCard) => {
        setClothingItems((items) =>
          items.map((prevItem) =>
            prevItem._id === item._id ? updatedCard.data : prevItem
          )
        );
      })
      .catch(console.error);
  };

  const handleEditProfileSubmit = (userData) => {
    const token = localStorage.getItem("jwt");
    updateUser(userData, token)
      .then((updatedUser) => setCurrentUser(updatedUser))
      .catch(console.error)
      .finally(closeActiveModal);
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser(null);
    window.location.href = "/";
  };

  // Load initial data
  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => setWeatherData(filterWeatherData(data)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    getItems()
      .then((data) => setClothingItems(data.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      checkToken(token)
        .then((userData) => {
          setIsLoggedIn(true);
          setCurrentUser(userData);
        })
        .catch(() => {
          setIsLoggedIn(false);
          localStorage.removeItem("jwt");
        });
    }
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <div className="page">
          <Header
            handleAddClick={() => openModal("add-garment")}
            weatherData={weatherData}
            setActiveModal={setActiveModal}
          />

          {activeModal === "login" && (
            <LoginModal
              closeActiveModal={closeActiveModal}
              onLogin={handleUserLogin}
              openRegisterModal={() => openModal("sign-up")}
            />
          )}

          {activeModal === "sign-up" && (
            <RegisterModal
              closeActiveModal={closeActiveModal}
              onRegister={handleUserRegister}
              openLoginModal={() => openModal("login")}
            />
          )}

          {activeModal === "add-garment" && (
            <AddItemModal
              closeActiveModal={closeActiveModal}
              onAddItem={handleAddItemSubmit}
            />
          )}

          {activeModal === "preview" && (
            <ItemModal
              onClose={closeActiveModal}
              card={selectedCard}
              handleDeleteClick={handleDeleteItem}
            />
          )}

          <Routes>
            <Route
              path="/"
              element={
                <Main
                  weatherData={weatherData}
                  clothingItems={clothingItems}
                  handleCardClick={(card) => openModal("preview", card)}
                  handleCardLike={handleCardLike}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  component={Profile}
                  isLoggedIn={isLoggedIn}
                  handleCardClick={(card) => openModal("preview", card)}
                  clothingItems={clothingItems}
                  handleAddClick={() => openModal("add-garment")}
                  handleSignOut={handleSignOut}
                  handleEditProfileClick={() => openModal("edit-profile")}
                  handleCardLike={handleCardLike}
                  handleDeleteClick={handleDeleteItem}
                />
              }
            />
          </Routes>

          {activeModal === "edit-profile" && (
            <EditProfileModal
              onClose={closeActiveModal}
              updateUser={handleEditProfileSubmit}
            />
          )}

          <Footer />
        </div>
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
