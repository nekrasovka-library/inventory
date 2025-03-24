import React, { createContext, useReducer } from "react";
import AlertComponent from "./AlertComponent";

export const AlertContext = createContext(null);

export default ({ children }) => {
  const [alert, dispatch] = useReducer(alertReducer, initialState);
  const value = { alert, dispatch };

  return (
    <AlertContext.Provider value={value}>
      <AlertComponent />
      {children}
    </AlertContext.Provider>
  );
};

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ALERT_ON":
      return {
        text: action.text,
        name: action.name,
        isAlert: true,
      };
    case "ALERT_OFF":
      return { ...state, isAlert: false };
    default:
      return state;
  }
};

const initialState = { text: "", name: "", isAlert: false };
