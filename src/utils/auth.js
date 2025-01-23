import checkResponse from "./Api";

const baseUrl = "http://localhost:3001";
const headers = {
  "Content-Type": "application/json",
};

function signUp({ name, avatar, email, password }) {
  console.log("Signing Up");
  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name, avatar, email, password }),
  }).then((res) => checkResponse(res)); // Removed syntax error
}

function signIn({ email, password }) {
  console.log("Signing In");
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, password }),
  }).then((res) => checkResponse(res));
}

function checkToken(token) {
  return fetch(`${baseUrl}/users/me`, {
    method: "GET",
    headers: {
      ...headers, // Reuse headers and add Authorization
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => checkResponse(res));
}

function sendNewUserData(userData, token) {
  return fetch(`${baseUrl}/users/me`, {
    method: "PATCH",
    headers: {
      ...headers, // Reuse headers and add Authorization
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  }).then((res) => checkResponse(res));
}

export { signUp, signIn, checkToken, sendNewUserData };
