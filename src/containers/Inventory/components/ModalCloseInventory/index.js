import React, { useContext, useState } from "react";
import styled from "styled-components";
import Button from "../../../../nekrasovka-ui/Button";
import { AlertContext } from "../../../../nekrasovka-ui/Alert/AlertProvider";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 20px;
`;

const InputField = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ModalCloseInventory = ({ patchCloseInventory, handleCloseModal }) => {
  const [actNumber, setActNumber] = useState(""); // Номер акта
  const [reason, setReason] = useState(""); // Причина списания, по умолчанию "29"
  const { dispatch } = useContext(AlertContext);

  const handleSubmit = async () => {
    if (actNumber) {
      await patchCloseInventory({
        w: actNumber,
        o: reason || "29",
      });
      handleCloseModal();
    } else {
      const text = `Укажите номер акта на списание`;

      dispatch({
        type: "ALERT_ON",
        name: "error",
        text,
      });
    }
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalTitle>Завершение инвентаризации</ModalTitle>
        <InputField>
          <Label>Номер акта</Label>
          <Input
            type="text"
            value={actNumber}
            onChange={(e) => setActNumber(e.target.value)}
            placeholder="Введите номер акта"
          />
        </InputField>
        <InputField>
          <Label>Причина списания</Label>
          <Input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Причина списания (по умолчанию '29')"
          />
        </InputField>
        <ButtonContainer>
          <Button onClick={handleCloseModal} name="Отмена" />
          <Button onClick={handleSubmit} name="Подтвердить" />
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModalCloseInventory;
