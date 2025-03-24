import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { AlertContext } from "./AlertProvider";
import { addFixed, delFixed } from "../../helpers";

export default () => {
  const { alert, dispatch } = useContext(AlertContext);
  const chkIsPortal = () => !!document.getElementById("portal").children.length;

  useEffect(() => {
    if (alert.isAlert) {
      if (chkIsPortal()) delFixed();
      const timeoutId = setTimeout(() => onClose(), 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [alert.isAlert]);

  const onClose = () => {
    dispatch({ type: "ALERT_OFF" });
    if (chkIsPortal()) addFixed();
  };

  return (
    <AlertContainer
      className={`${alert.name} ${alert.isAlert ? "slideIn" : "slideOut"}`}
    >
      <div dangerouslySetInnerHTML={{ __html: alert.text }} />
      <AlertClose onClick={onClose}>
        <i className="fa fa-close" aria-hidden="true"></i>
      </AlertClose>
    </AlertContainer>
  );
};

const AlertContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: fixed;
  z-index: 111111111;
  top: 0;
  right: 0;
  padding: 10px 15px;
  transition: transform 0.2s ease-out;

  &.slideIn {
    animation-name: slideIn;
    animation-duration: 0.2s;
    animation-timing-function: ease-in-out;
  }

  &.slideOut {
    transform: translateY(-100%);
  }

  &.error,
  &.success,
  &.warning {
    color: #ffffff;
  }

  &.info {
    background-color: #ffffff;
    color: #222222;
  }

  &.error {
    background-color: #a36257;
  }

  &.success {
    background-color: #8d957c;
  }

  &.warning {
    background-color: #ffad20;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @media (min-width: 769px) {
    width: 50%;
  }

  @media (max-width: 768px) {
    width: calc(100% - 30px);
    font-size: 14px;
  }

  @media (max-width: 700px) {
    width: 100%;
  }
`;

const AlertClose = styled.div`
  cursor: pointer;
`;
