import React from "react";
import icons from "./icons";

export default ({ icon, ...props }) => {
  const Icon = icons[icon];

  return <Icon {...props} />;
};
