import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import { Provider } from "react-redux";
import configureStore from "./store";
import App from "./containers/App";

const root = document.getElementById("root");
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  root,
);
