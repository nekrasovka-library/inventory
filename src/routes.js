import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Inventory from "./containers/Inventory";

export default () => (
  <Switch>
    <Route path="/inventory" component={Inventory} />
    <Redirect to="/inventory" />
  </Switch>
);
