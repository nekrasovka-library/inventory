import React from "react";
import Button from "../../../../nekrasovka-ui/Button";
import styled from "styled-components";

export default ({
  closeInventory,
  getStatistics,
  inventory,
  type,
  setType,
}) => {
  const isType3 = type === 3;
  const isType2 = type === 2;
  const isType1 = type === 1;
  const isType0 = type === 0;

  return (
    <Navigation>
      <div>
        <TitleButton
          isInventory={inventory.loaded}
          isActive={isType1 || isType0}
          onClick={() => {
            if (inventory.loaded) {
              getStatistics(inventory.id);
              setType(1);
            } else setType(0);
          }}
        >
          Инвентаризация фонда
        </TitleButton>
        <TitleButton
          isDisabled={!inventory.loaded}
          isActive={isType2}
          onClick={() => {
            if (inventory.loaded) {
              getStatistics(inventory.id);
              setType(isType2 ? 1 : 2);
            }
          }}
        >
          Необработанные
        </TitleButton>
        <TitleButton
          isActive={isType3}
          onClick={() => setType(isType3 ? (inventory.loaded ? 1 : 0) : 3)}
        >
          Архив
        </TitleButton>
      </div>
      <div>
        {inventory.loaded && (
          <Button name="Завершить инвентаризацию" onClick={closeInventory} />
        )}
      </div>
    </Navigation>
  );
};

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;

  a,
  button {
    padding: 7px 10px;
    height: auto;
  }

  > div {
    display: flex;
    column-gap: 20px;
  }

  @media (min-width: 769px) {
    align-items: center;
  }

  @media (max-width: 768px) {
    padding: 0 15px;
    flex-direction: column;
    row-gap: 20px;

    > div:first-child {
      flex-wrap: wrap;
      row-gap: 20px;
    }
  }
`;

const TitleButton = styled.div`
  display: flex;
  align-items: start;
  cursor: pointer;
  height: 33px;
  font-size: 18px;
  border-bottom: 5px solid
    ${({ isActive }) => (isActive ? "#ffad20" : "#edeee9")};
  ${({ isDisabled }) => isDisabled && "opacity: 0.5;"};
  ${({ isActive, isDisabled }) =>
    !isActive &&
    !isDisabled &&
    ":hover {border-bottom: 5px solid rgba(255, 173, 32, 0.5);}"};
`;
