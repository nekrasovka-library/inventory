import React, { createContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import Keycloak from "keycloak-js";
import store from "./store";
import auth from "./auth";

const keycloakInstance = new Keycloak(store.keycloak.onInit);

export const KeycloakContext = createContext({});

export default ({ children = null }) => {
  const [state, setState] = useState(store.state);
  const history = useHistory();
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (pathname !== "/kc/callback") {
      store.location.set(`${pathname}${search}`);
    }
  }, [pathname, search]);

  useEffect(() => {
    auth.login(keycloakInstance, setState, history);
  }, []);

  const handleLogout = () => {
    auth.logout(keycloakInstance, setState);
  };

  const refreshTokenIfExpired = async () => {
    try {
      const refreshed = await keycloakInstance.updateToken();
      return { TOKEN_KEY: keycloakInstance.token, refreshed };
    } catch (error) {
      console.error("Failed to update token:", error);
    }
  };

  if (!state.initialized) return null;

  return (
    <KeycloakContext.Provider
      value={{
        onExit: handleLogout,
        checkTokenExpiredYesUpdate: refreshTokenIfExpired,
        roles: state.roles,
        name: state.name,
        user: state.user,
        department: state.department,
        tokenParsed: state.tokenParsed,
      }}
    >
      {children}
    </KeycloakContext.Provider>
  );
};
