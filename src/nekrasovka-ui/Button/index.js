import React from "react";
import styled from "styled-components";

export default ({
  isActive,
  onClick,
  name,
  buttonStyles,
  isDisabled = false,
  className,
  btnTooltip = "",
}) => {
  return (
    <Button
      btnTooltip={btnTooltip}
      className={className}
      disabled={isDisabled}
      buttonStyles={buttonStyles}
      isActive={isActive}
      onClick={onClick}
    >
      {name}
    </Button>
  );
};

const Button = styled.button`
  border: 1px solid #c4c4c4;
  border-radius: 2px;
  height: fit-content;
  width: fit-content;
  position: relative;
  padding: 8px 25px;
  margin: 0;

  :disabled {
    background-color: #edeee9ff;
    color: initial;
  }

  &:not([disabled]) {
    background-color: ${({ isActive }) => (isActive ? "#40677e" : "initial")};
    color: ${({ isActive }) => (isActive ? "#edeee9" : "#222222")};
  }

  @media (hover: hover) {
    :not([disabled]) {
      cursor: pointer;

      :hover {
        background-color: #40677e;
        color: #edeee9;

        ${({ btnTooltip }) =>
          btnTooltip &&
          `
          ::after, 
          ::before {
          position: absolute;
          background-color: #ffffff;
          }
          
          ::after {
          content: "${btnTooltip}";
          bottom: 160%;
          left: 0;
          padding: 10px;
          color: #222222;
          z-index: 0;
          box-shadow: 0 0 7px 0 rgb(0 0 0 / 27%);
          width: max-content;
          max-width: 25vw;
          text-align: left;
        }

        ::before {
          content: "";
          left: 10px;
          top: -23px;
          width: 15px;
          height: 15px;
          z-index: 1;
          transform: rotate(45deg);
          box-shadow: 20px 20px 20px 5px rgb(0 0 0 / 27%);
        }`}
      }
    }
  }

  ${({ buttonStyles }) => buttonStyles};
`;
