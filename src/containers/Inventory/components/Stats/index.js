import React from "react";
import Button from "../../../../nekrasovka-ui/Button";
import styled from "styled-components";

export default ({
  type,
  inventory,
  statistics,
  exportPENDING,
  exportINITIAL,
}) => {
  const isType3 = type === 3;
  const isType2 = type === 2;

  return (
    <Container>
      <>
        <ContainerChild>
          <div>
            <div>Логин владельца, который начал инвентаризацию</div>
            <div>{inventory.owner}</div>
          </div>
        </ContainerChild>
        <ContainerChild>
          <div>
            <div>Общая статистика</div>
            <div>
              Проверено {statistics.found} из {statistics.total}
            </div>
          </div>
        </ContainerChild>
      </>
      {(isType2 || isType3) && (
        <>
          <ContainerChild>
            <div>
              <div>Список необработанных</div>
              <div>{statistics.pending}</div>
            </div>
            <Button
              isDisabled={!statistics.pending}
              name="Скачать"
              onClick={() => exportPENDING({ id: statistics.id })}
            />
          </ContainerChild>
          <ContainerChild>
            <div>
              <div>Исходный список инвентарников</div>
              <div>{statistics.total}</div>
            </div>
            <Button
              name="Скачать"
              onClick={() => exportINITIAL({ id: statistics.id })}
            />
          </ContainerChild>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px 100px;
  width: 100%;
  font-size: 13px;
`;

const ContainerChild = styled.div`
  display: flex;
  justify-content: space-between;

  > div {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    div {
      :first-child {
        font-weight: 500;
      }

      :last-child {
        color: #777777;
      }
    }
  }
`;
