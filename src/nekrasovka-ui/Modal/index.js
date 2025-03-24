import React, { useEffect } from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { addFixed, delFixed } from "../../helpers";

export default ({ children }) => {
  const portal = document.getElementById("portal");

  useEffect(() => {
    addFixed();

    return () => delFixed();
  }, []);

  return createPortal(<Modal>{children}</Modal>, portal);
};

const Modal = styled.div`
  background-color: #222222ab;
  overflow: auto;
  scroll-behavior: smooth;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;

  @media (min-width: 769px) {
    padding: 100px;
  }
`;
