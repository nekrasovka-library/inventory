export default {
  state: {
    initialized: false,
    roles: [],
    name: "",
    user: "",
    department: "",
    tokenParsed: {},
  },
  location: {
    get: () => localStorage.getItem("APP_LOCATION"),
    set: (location) => localStorage.setItem("APP_LOCATION", location),
  },
  keycloak: {
    onInit: {
      url: process.env.REACT_APP_KEYCLOAK_BASE_URL,
      realm: process.env.REACT_APP_KEYCLOAK_REALM,
      clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    },
    onAuth: {
      onLoad: "login-required",
      redirectUri: `${process.env.REACT_APP_KEYCLOAK_APP_URL}/kc/callback`,
    },
  },
};
