import React from "react";
import Button from "../../../../../../nekrasovka-ui/Button";
import styled from "styled-components";

export default ({
  id,
  exportINITIAL,
  exportPENDING,
  owner,
  pending,
  total,
  difference,
}) => {
  return (
    <Container className="archive_stats">
      <td colSpan="3">
        <div>
          <ContainerChild>
            <div>
              <div>Логин владельца, который начал инвентаризацию</div>
              <div>{owner}</div>
            </div>
          </ContainerChild>
          <ContainerChild>
            <div>
              <div>Общая статистика</div>
              <div>
                Проверено {difference} из {total}
              </div>
            </div>
          </ContainerChild>
          <ContainerChild>
            <div>
              <div>Список необработанных</div>
              <div>{pending}</div>
            </div>
            <Button
              isDisabled={!pending}
              name="Скачать"
              onClick={() => exportPENDING({ id })}
            />
          </ContainerChild>
          <ContainerChild>
            <div>
              <div>Исходный список инвентарников</div>
              <div>{total}</div>
            </div>
            <Button name="Скачать" onClick={() => exportINITIAL({ id })} />
          </ContainerChild>
        </div>
      </td>
    </Container>
  );
};

const Container = styled.tr`
  td > div {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px 100px;
    font-size: 13px;
  }
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
`;
