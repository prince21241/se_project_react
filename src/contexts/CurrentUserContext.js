import React from "react";

const CurrentUserContext = React.createContext();

export default CurrentUserContext;

/* import { createContext } from "react";

export const CurrentUserContext = createContext({
  currentUser: null,
  setCurrentUser: () => {}, // Default to a no-op function
}); */
