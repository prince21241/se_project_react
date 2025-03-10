import { baseUrl } from "./constants";

export const checkRes = (res) => {
  if (!res.ok) {
    return res.json().then((data) => {
      throw new Error(data.message || `Error: ${res.status}`);
    });
  }
  return res.json();
};

function getHeadersWithAuth(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function getItems(weatherType) {
  const query = weatherType ? `?weather_like=${weatherType}` : "";
  return fetch(`${baseUrl}/items${query}`).then(checkRes);
}

function postItem(item, token) {
  return fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Ensure token is included
    },
    body: JSON.stringify(item),
  }).then(checkRes);
}

function deleteItem(itemId, token) {
  console.log(`Deleting item with _id: ${itemId}`); // Debug log
  return fetch(`${baseUrl}/items/${itemId}`, {
    method: "DELETE",
    headers: getHeadersWithAuth(token),
  }).then(checkRes);
}

function getUserData(token) {
  return fetch(`${baseUrl}/users/me`, {
    method: "GET",
    headers: getHeadersWithAuth(token),
  }).then(checkRes);
}

export const updateUser = (userData, token) => {
  return fetch(`${baseUrl}/users/me`, {
    method: "PATCH",
    headers: getHeadersWithAuth(token),
    body: JSON.stringify(userData),
  }).then(checkRes);
};

export const addCardLike = (id, token) => {
  return fetch(`${baseUrl}/items/${id}/likes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(checkRes);
};

export const removeCardLike = (id, token) => {
  return fetch(`${baseUrl}/items/${id}/likes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(checkRes);
};

export { getItems, postItem, deleteItem, getUserData };
