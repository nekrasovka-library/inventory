import React, { useEffect } from "react";
import Button from "../../../../nekrasovka-ui/Button";
import styled from "styled-components";
import CustomSelect from "../../../../nekrasovka-ui/CustomSelect";

export default ({
  formatedToday,
  inventory,
  setInventory,
  commentRef,
  handleInventory,
  handleRange,
  rangeRef,
  handleFile,
  getInventoryBase,
  inventoryBase,
}) => {
  useEffect(() => {
    getInventoryBase();
  }, []);

  const isDisabled =
    !inventory.name || !inventory.dbid || !inventory.range.fileName;

  return (
    <Container>
      <h4>{formatedToday}</h4>
      <HeaderExclude>
        <h4>Выбор целевой базы</h4>
        <div>
          <CustomSelect
            options={inventoryBase}
            value={inventory.dbid}
            onChange={(value) => setInventory({ ...inventory, dbid: value })}
            placeholder="-"
          />
        </div>
      </HeaderExclude>
      <HeaderExclude>
        <h4>Название инвентаризации</h4>
        <div>
          <input
            value={inventory.name}
            name="name"
            type="text"
            placeholder="Название инвентаризации"
            onChange={(e) =>
              setInventory({ ...inventory, name: e.target.value })
            }
          />
        </div>
      </HeaderExclude>
      <HeaderExclude>
        <h4>Комментарий</h4>
        <div>
          <textarea
            disabled
            ref={commentRef}
            value={inventory.comment}
            name="comment"
            placeholder="Комментарий"
            onChange={(e) =>
              setInventory({
                ...inventory,
                comment: e.target.value,
              })
            }
          />
        </div>
      </HeaderExclude>
      <HeaderExclude>
        <h4>Пометка для экземпляра</h4>
        <div>
          <input
            disabled
            value={inventory.exclude}
            name="exclude"
            type="text"
            placeholder="Пометка для экземпляра"
            onChange={(e) =>
              setInventory({
                ...inventory,
                exclude: e.target.value,
              })
            }
          />
        </div>
      </HeaderExclude>
      <HeaderExclude>
        <h4>Диапазон инвентарных номеров</h4>
        <ButtonRange
          onClick={handleRange}
          name={
            !!inventory.range.fileName
              ? inventory.range.fileName
              : "Загрузить в формате CSV"
          }
        />
        <input
          hidden
          ref={rangeRef}
          name="range"
          type="file"
          onChange={handleFile}
        />
      </HeaderExclude>
      <Button
        name="Сохранить"
        isDisabled={isDisabled}
        onClick={handleInventory}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;

  > div {
    width: 100%;
  }
`;

const HeaderExclude = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;

  > div {
    display: flex;
    column-gap: 10px;
    height: 33px;
    width: 100%;
  }

  input,
  textarea,
  select {
    padding: 5px 10px;
    font-size: 13px;
    border: 1px solid rgb(196, 196, 196);
  }

  @media (min-width: 701px) {
    width: fit-content;

    input,
    textarea,
    select {
      min-width: 131px;
      width: 100%;

      ::placeholder {
        color: transparent;
      }
    }
  }

  @media (max-width: 700px) {
    h4 {
      display: none;
    }

    input,
    textarea,
    select {
      width: 100%;
    }
  }
`;

const ButtonRange = styled(Button)`
  width: 100%;
`;
