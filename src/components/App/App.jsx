import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { coordinates, APIkey } from "../../utils/constants";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Main from "../Main/Main";
import Profile from "../Profile/Profile";
import ItemModal from "../ItemModal/ItemModal";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import { CurrentTemperatureUnitContext } from "../../contexts/CurrentTemperatureUnitContext";
import AddItemModal from "../AddItemModal/AddItemModal";
import { getItems } from "../../utils/api";
import { postItem } from "../../utils/api";
import { deleteItem } from "../../utils/api";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import LoginModal from "../LoginModal/LoginModal";

function App() {
  const [activeModal, setActiveModal] = useState("");
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999 },
    city: "",
  });

  const [selectedCard, setSelectedCard] = useState({});
  const [currentTempUnit, setCurrentTempUnit] = useState("F");
  const [clothingItems, setClothingItems] = useState([]);

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  const handleToggleSwitchChange = () => {
    if (currentTempUnit === "C") setCurrentTempUnit("F");
    if (currentTempUnit === "F") setCurrentTempUnit("C");
  };

  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    getItems()
      .then((data) => {
        setClothingItems(data);
      })
      .catch(console.error);
  }, []);

  function onAddItem({ name, weather, link }) {
    postItem(name, link, weather)
      .then((data) => {
        setClothingItems((prev) => [data, ...prev]);
        closeActiveModal();
      })
      .catch(console.error);
  }

  function handleDeleteItem() {
    deleteItem(selectedCard._id)
      .then(() => {
        setClothingItems((prev) =>
          prev.filter((item) => item._id !== selectedCard._id)
        );
        closeActiveModal();
      })
      .catch(console.error);
  }

  const openDeleteModal = () => {
    setActiveModal("delete");
  };

  // User registration
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

  // User login
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

  // Function to handle liking/disliking an item
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

  // Function to handle editing profile
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

  // Function to handle signing out
  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser(null);
    window.location.href = "/";
  };

  // Load weather data on mount
  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch((err) => console.error("Error fetching weather data:", err));
  }, []);

  // Load clothing items on mount
  useEffect(() => {
    getItems()
      .then((data) => setClothingItems(data.data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  // Validate token and fetch user data on mount
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
      setIsLoggedIn(false); // user is not logged in.
    }
  }, []);

  useEffect(() => {
    console.log("Active modal state changed to:", activeModal);
  }, [activeModal]);

  return (
    <div className="page">
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTempUnit, handleToggleSwitchChange }}
      >
        <div className="page__content">
          <Header handleAddClick={handleAddClick} weatherData={weatherData} />
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  clothingItems={clothingItems}
                  weatherData={weatherData}
                  handleCardClick={handleCardClick}
                />
              }
              {activeModal === "login" && (
                <>
                  {console.log("rendering LoginModal")}
                  <LoginModal
                      closeActiveModal={closeActiveModal}
                      onLogin={handleUserLogin}
                      isOpen={activeModal === "login"}
                      openRegisterModal={() => setActiveModal("sign-up")}
                  />
                </>
              )}
            />
            <Route
              //and here aswell
              path="/profile"
              element={
                <Profile
                  clothingItems={clothingItems}
                  weatherData={weatherData}
                  onCardClick={handleCardClick}
                  handleAddClick={handleAddClick}
                />
              }
            />
          </Routes>

          <Footer />
        </div>

        <AddItemModal
          isOpen={activeModal === "add-garment"}
          onAddItem={onAddItem}
          onClose={closeActiveModal}
        ></AddItemModal>
        <ItemModal
          activeModal={activeModal}
          card={selectedCard}
          openDeleteModal={openDeleteModal}
          handleCloseClick={closeActiveModal}
        />
        <ConfirmDeleteModal
          activeModal={activeModal === "delete"}
          handleDeleteItem={handleDeleteItem}
          closeActiveModal={closeActiveModal}
        />
      </CurrentTemperatureUnitContext.Provider>
    </div>
  );
}

export default App;
