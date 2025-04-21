import React, { useState } from "react";
import styled from "styled-components";

export default ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (key) => {
    onChange(key);
    setIsOpen(false);
  };

  const filteredOptions = options.filter((option) => option.key !== value);

  return (
    <SelectContainer>
      <CustomSelectButton onClick={() => setIsOpen(!isOpen)}>
        {value ? options.find((opt) => opt.key === value)?.label : placeholder}
        <Arrow isOpen={isOpen} />
      </CustomSelectButton>
      {isOpen && (
        <Dropdown>
          {filteredOptions.map((option) => (
            <DropdownItem
              key={option.key}
              onClick={() => handleSelect(option.key)}
            >
              {option.label}
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </SelectContainer>
  );
};

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
  font-size: 13px;
`;

const CustomSelectButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgb(196, 196, 196);
  padding: 5px 10px;
  cursor: pointer;
  user-select: none;
  background-color: white;
  height: 33px;
`;

const Arrow = styled.div`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: ${(props) => (props.isOpen ? 0 : "5px solid black")};
  border-bottom: ${(props) => (props.isOpen ? "5px solid black" : 0)};
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% - 1px);
  left: 0;
  right: 0;
  overflow-y: auto;
  border: 1px solid rgb(196, 196, 196);
  background: white;
  z-index: 1000;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  cursor: pointer;
  height: 33px;

  &:hover {
    background: rgb(230, 230, 230);
  }
`;
