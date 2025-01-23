import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useContext, useEffect, useState } from "react";
import CurrentUserContext from "../../Context/CurrentUserContext";

function EditProfileModal({ handleCloseModal, handleUpdateUserInfo, isOpen }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  const { currentUser } = useContext(CurrentUserContext);
  console.log(currentUser);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleAvatarChange = (e) => {
    setAvatar(e.target.value);
  };

  useEffect(() => {
    return () => {
      setName(currentUser.name);
      setAvatar(currentUser.avatar);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Avatar:", avatar);
    const token = localStorage.getItem("jwt");
    handleUpdateUserInfo({ name, avatar }, token);
  };

  return (
    <ModalWithForm
      title="Change Profile Data"
      buttonText="Save Changes"
      isOpen={isOpen}
      handleCloseModal={handleCloseModal}
      onSubmit={handleSubmit}
    >
      <label htmlFor="name" className="modal__form-label">
        Name {""}
        <input
          type="name"
          className="modal__form-input"
          id="name"
          placeholder="Name"
          value={name}
          onChange={handleNameChange}
        ></input>
      </label>
      <label className="modal__form-label">
        Avatar {""}
        <input
          type="url"
          className="modal__form-input"
          id="url"
          placeholder="Enter Url"
          value={avatar}
          onChange={handleAvatarChange}
        ></input>
      </label>
    </ModalWithForm>
  );
}

export default EditProfileModal;
