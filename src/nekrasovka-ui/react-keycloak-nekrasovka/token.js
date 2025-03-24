import jwt_decode from "jwt-decode";

export default {
  get: () => localStorage.getItem("TOKEN_KEY"),
  set: (token) => localStorage.setItem("TOKEN_KEY", token),
  details: () => jwt_decode(localStorage.getItem("TOKEN_KEY")),
  clear: () => localStorage.clear(),
};
