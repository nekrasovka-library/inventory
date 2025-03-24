import React, { useEffect, useRef } from "react";
import Button from "../../../../nekrasovka-ui/Button";
import styled from "styled-components";
import ContentModal from "../../../../nekrasovka-ui/ContentModal";

export default ({
  handleGetBarcodes,
  handleManual,
  handleRFID,
  handleTypeBarcode,
  isManual,
  isRfidOpen,
  rfid,
  selectedRFID,
  setIsRfidOpen,
  barcode,
  setIsManual,
  isModalOpen,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!!inputRef.current) {
      if (isModalOpen) inputRef.current.blur();
      else inputRef.current.focus();
    }
  }, [isModalOpen]);

  return (
    <Container>
      <div>
        <Button
          name={isManual ? "RFID-сканер" : "Ручной ввод"}
          onClick={handleManual}
        />
        {isManual ? (
          <HeaderManual>
            <div>
              <input
                ref={inputRef}
                name="barcode"
                type="text"
                value={barcode}
                placeholder="Баркод или инвентарный номер"
                onChange={handleTypeBarcode}
              />
              <Button
                isDisabled={!barcode}
                name="Искать"
                onClick={handleGetBarcodes}
              />
            </div>
          </HeaderManual>
        ) : (
          <HeaderRFID>
            <Button
              name={!!selectedRFID ? selectedRFID : "Выберите RFID-сканер"}
              onClick={() => {
                if (rfid.error) {
                  const isManualConfirm = confirm(
                    "Не обнаружены подключенные RFID-устройства. Продолжить работу в ручном режиме?",
                  );

                  if (isManualConfirm) {
                    setIsManual(true);
                  }
                } else {
                  setIsRfidOpen(!isRfidOpen);
                }
              }}
            />
            {rfid.loaded && (
              <ContentModalHeaderRFID
                setIsContentModal={setIsRfidOpen}
                isContentModal={isRfidOpen}
              >
                <ContentModalChildren>
                  <div>
                    {rfid.data.map((rfidItem, rfidIndex) => {
                      const isActive = rfidItem.id === selectedRFID;
                      const isDisabled = !rfidItem.isOnline;

                      return (
                        <RfidItem
                          key={rfidIndex}
                          isActive={isActive}
                          isDisabled={isDisabled}
                          onClick={() => {
                            !isDisabled && handleRFID(rfidItem.id);
                          }}
                        >
                          {rfidItem.id}
                        </RfidItem>
                      );
                    })}
                  </div>
                </ContentModalChildren>
              </ContentModalHeaderRFID>
            )}
          </HeaderRFID>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  height: 40px;

  > div {
    display: flex;
    column-gap: 10px;
  }
`;

const HeaderManual = styled.div`
  display: flex;

  input {
    padding: 5px 10px;
    font-size: 13px;
    border: 1px solid rgb(196, 196, 196);
  }

  button {
    height: 100%;

    :disabled {
      opacity: 0.5;
    }
  }

  > div {
    display: flex;
    column-gap: 10px;
    height: 33px;
    width: 100%;
  }

  @media (min-width: 701px) {
    display: flex;
    width: fit-content;
    flex-direction: column;
    row-gap: 15px;

    input {
      width: 219px;
    }
  }

  @media (max-width: 700px) {
    h4 {
      display: none;
    }

    input {
      width: 100%;
    }
  }
`;

const HeaderRFID = styled.div`
  position: relative;
  z-index: 111;
`;

const ContentModalHeaderRFID = styled(ContentModal)`
  min-width: 100%;
  top: 43px;

  > div {
    min-width: fit-content;

    > div {
      width: auto;
    }

    ::after {
      left: 15px;
    }
  }
`;

const ContentModalChildren = styled.div`
  row-gap: 15px;
  padding: 15px;
  min-height: auto;
  color: #222222;

  &,
  > div {
    display: flex;
    flex-direction: column;
  }

  > div {
    row-gap: 10px;
  }

  @media (min-width: 769px) {
    width: 250px;
  }

  @media (max-width: 768px) {
    width: calc(100vw - 30px);
  }
`;

const RfidItem = styled.div`
  font-size: 13px;
  cursor: pointer;

  ${({ isDisabled }) => isDisabled && "opacity: 0.5;"};

  ${({ isActive }) =>
    isActive
      ? "color: #40677e;"
      : "@media (hover: hover) {:hover {color: #40677e;}}"};
`;
