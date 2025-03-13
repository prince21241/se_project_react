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
import { getItems, deleteItem, postItem, updateUser } from "../../utils/api";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { signin, signup, checkToken } from "../../utils/auth";
import { addCardLike, removeCardLike } from "../../utils/api";
import LoginModal from "../LoginModal/LoginModal.jsx";
import RegisterModal from "../RegisterModal/RegisterModal.jsx";
import EditProfileModal from "../EditProfileModal/EditProfileModal.jsx";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999 },
    city: "",
  });

  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});

  const [clothingItems, setClothingItems] = useState([]);

  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const closeActiveModal = () => setActiveModal("");

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit((prevUnit) => (prevUnit === "F" ? "C" : "F"));
  };

  const handleAddItemSubmit = (item) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("You must be logged in to add items.");
      return;
    }

    const newItem = {
      name: item.name,
      imageUrl: item.link,
      weather: item.weather.toLowerCase(),
    };

    postItem(newItem, token)
      .then((savedItem) => {
        setClothingItems([savedItem, ...clothingItems]);
        closeActiveModal();
      })
      .catch((error) => console.error("Error adding item:", error));
  };

  const handleDeleteItem = (itemToDelete) => {
    const token = localStorage.getItem("jwt");

    deleteItem(itemToDelete._id, token)
      .then(() => {
        setClothingItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemToDelete._id)
        );
        closeActiveModal();
      })
      .catch((error) => console.error("Error deleting item:", error));
  };

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
      .catch((err) => alert("Registration or login failed. Please try again."));
  };

  const handleUserLogin = ({ email, password }) => {
    signin({ email, password })
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setIsLoggedIn(true);
        setCurrentUser(res.user);
        console.log(res.user);
        closeActiveModal();
      })
      .catch(() => alert("Login failed. Please check your credentials."));
  };

  const handleCardLike = (item) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      alert("You must be logged in to like items.");
      return;
    }

    const isLiked = item.likes.includes(currentUser?._id);
    const likeRequest = !isLiked
      ? addCardLike(item._id, token)
      : removeCardLike(item._id, token);

    likeRequest
      .then((updatedCard) => {
        setClothingItems((items) =>
          items.map((prevItem) =>
            prevItem._id === item._id ? updatedCard.data : prevItem
          )
        );
      })
      .catch((err) => console.error("Error updating likes:", err));
  };

  const handleEditProfileClick = () => {
    console.log("Opening Edit Profile Modal");
    setActiveModal("edit-profile");
  };

  const handleEditProfileSubmit = (userData) => {
    const token = localStorage.getItem("jwt");
    updateUser(userData, token)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeActiveModal();
      })
      .catch((err) => console.error("Error updating user profile:", err));
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser(null);
    window.location.href = "/";
  };

  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch((err) => console.error("Error fetching weather data:", err));
  }, []);

  useEffect(() => {
    getItems()
      .then((data) => setClothingItems(data))
      .catch((err) => console.error("Error fetching items:", err));
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
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    console.log("Active modal state changed to:", activeModal);
  }, [activeModal]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <div className="page">
          <Header
            handleAddClick={handleAddClick}
            weatherData={weatherData}
            setActiveModal={setActiveModal}
          />
          {activeModal === "login" && (
            <>
              {console.log("Rendering LoginModal")}
              <LoginModal
                closeActiveModal={closeActiveModal}
                onLogin={handleUserLogin}
                isOpen={activeModal === "login"}
                openRegisterModal={() => setActiveModal("sign-up")}
              />
            </>
          )}
          {activeModal === "sign-up" && (
            <>
              {console.log("Rendering RegisterModal")}
              <RegisterModal
                onRegister={handleUserRegister}
                closeActiveModal={closeActiveModal}
                onSignup={handleUserRegister}
                isOpen={activeModal === "sign-up"}
                openLoginModal={() => setActiveModal("login")}
              />
            </>
          )}
          {activeModal === "add-garment" && (
            <>
              {console.log("Rendering AddItemModal")}
              <AddItemModal
                closeActiveModal={closeActiveModal}
                onAddItem={handleAddItemSubmit}
                activeModal={activeModal}
              />
            </>
          )}
          {activeModal === "preview" && (
            <>
              {console.log("Rendering ItemModal")}
              <ItemModal
                onClose={closeActiveModal}
                activeModal={activeModal}
                card={selectedCard}
                handleDeleteClick={handleDeleteItem}
              />
            </>
          )}
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  weatherData={weatherData}
                  clothingItems={clothingItems}
                  handleCardClick={handleCardClick}
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
                  handleCardClick={handleCardClick}
                  clothingItems={clothingItems}
                  handleAddClick={handleAddClick}
                  handleSignOut={handleSignOut}
                  handleEditProfileClick={handleEditProfileClick}
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
              activeModal={activeModal}
              handleDeleteClick={handleDeleteItem}
            />
          )}
          <Footer />
        </div>
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
