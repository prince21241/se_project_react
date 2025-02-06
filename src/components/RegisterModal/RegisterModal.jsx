import React, { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./RegisterModal.css";

const RegisterModal = ({
  closeActiveModal,
  onRegister,
  isOpen,
  openLoginModal,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(""); // Added avatar state

  const handleChange = (e) => {
    setAvatar(e.target.value); // Handle avatar URL input changes
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ name, email, password, avatar }); // Include avatar in registration
  };

  return (
    <ModalWithForm
      title="Sign Up"
      buttonText="Register"
      isOpen={isOpen}
      onClose={closeActiveModal}
      onSubmit={handleSubmit}
    >
      <label className="modal__label">
        Name
        <input
          type="text"
          className="modal__input"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="modal__label">
        Email
        <input
          type="email"
          className="modal__input"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="modal__label">
        Password
        <input
          type="password"
          className="modal__input"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button
        type="button"
        onClick={openLoginModal}
        className="modal__secondary-button"
      >
        or login
      </button>
      <label className="modal__label" htmlFor="avatar-url">
        Avatar URL*
        <input
          className="modal__input"
          type="url"
          id="avatar-url"
          name="avatar"
          placeholder="Avatar URL"
          required
          onChange={handleChange}
          value={avatar} // Use avatar state
        />
      </label>
    </ModalWithForm>
  );
};

export default RegisterModal;
