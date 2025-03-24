import React from "react";
import { BrowserRouter } from "react-router-dom";

import Header from "./Header";
import Main from "./Main";
import AlertProvider from "../nekrasovka-ui/Alert/AlertProvider";
import KeycloakProvider from "../nekrasovka-ui/react-keycloak-nekrasovka";

export default () => {
  return (
    <BrowserRouter>
      <KeycloakProvider>
        <AlertProvider>
          <Header />
          <Main />
        </AlertProvider>
      </KeycloakProvider>
    </BrowserRouter>
  );
};
