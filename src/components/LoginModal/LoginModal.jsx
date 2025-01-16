import { useState } from "react";
import "./LoginModal.css";
import { Link } from "react-router-dom";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function LoginModal({
  onClose,
  isOpen,
  onSubmit,
  handleAddRegistration,
  handleShowLogin,
}) {
  if (!isOpen) {
    return null;
  }
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <ModalWithForm
      title="Log In"
      buttonText="Log In"
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleSubmit}
    >
      <label htmlFor="email" className="modal__label">
        Email
        <input
          type="email"
          className="modal__input"
          id="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleEmailChange}
        />
      </label>
      <label htmlFor="password" className="modal__label">
        Password
        <input
          type="password"
          className="modal__input"
          id="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </label>
      <div className="login__modal">
        <button
          type="submit"
          className="login__button-modal"
          onClick={handleShowLogin}
        >
          Log In
        </button>
        <button
          type="submit"
          className="signup__button-modal"
          onClick={handleAddRegistration}
        >
          Or Sign up
        </button>
      </div>
    </ModalWithForm>
  );
}

export default LoginModal;
