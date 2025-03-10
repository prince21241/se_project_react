import { checkRes } from "./api";

import { baseUrl } from "./constants";
// Function to handle user registration
export const signup = ({ name, avatar, email, password }) => {
  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, avatar, email, password }),
  })
    .then(checkRes)
    .catch((error) => {
      console.error("Error in signup:", error);
      throw error;
    });
};

// Function to handle user login
export const signin = ({ email, password }) => {
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then(checkRes)
    .catch((error) => {
      console.error("Error in signin:", error);
      throw error;
    });
};

// Function to validate token
export const checkToken = (token) => {
  return fetch(`${baseUrl}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  })
    .then(checkRes)
    .catch((error) => {
      console.error("Error validating token:", error);
      throw error;
    });
};
