import React, { useEffect, useState } from "react";
import Icon from "../../../../nekrasovka-ui/Icon";
import styled from "styled-components";

export default ({
  handleVerification,
  setVerification,
  verification,
  inventoryId,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const clearVerification = () => {
    setVerification({
      ...verification,
      data: [],
      loaded: false,
      total: 0,
    });
  };

  const handlePreviousClick = async () => {
    if (currentPage > 1) {
      const url = `https://cataloguisation.api.nekrasovka.ru/api/cataloguing/${inventoryId}/books?status=PENDING&limit=${verification.limit}&page=${currentPage - 1}`;

      handleVerification(url);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = async () => {
    if (currentPage < verification.total) {
      const url = `https://cataloguisation.api.nekrasovka.ru/api/cataloguing/${inventoryId}/books?status=PENDING&limit=${verification.limit}&page=${currentPage + 1}`;

      handleVerification(url);
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    handleVerification();

    return () => clearVerification();
  }, []);

  return (
    <Container>
      {verification.loaded ? (
        <>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Идентификатор</th>
                  <th>Описание из АБИС</th>
                  <th>Инвентарный номер</th>
                </tr>
              </thead>
              <tbody>
                {verification.data.map((dataItem, dataIndex) => {
                  return (
                    <tr key={dataIndex}>
                      <td>{dataItem.identificator}</td>
                      <td>
                        {dataItem.title}, {dataItem.author}
                      </td>
                      <td>{dataItem.serial}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <TablePagination>
            <TablePaginationIconButton
              onClick={handlePreviousClick}
              isDisabled={currentPage === 1}
            >
              <Icon icon="arrowLineLeft" height={30} />
            </TablePaginationIconButton>
            <div>
              <span>Страница</span>
              <span>{currentPage}</span>
              <span>из</span>
              <span>{verification.total}</span>
            </div>
            <TablePaginationIconButton
              onClick={handleNextClick}
              isDisabled={currentPage === verification.total}
            >
              <Icon icon="arrowLineRight" height={30} />
            </TablePaginationIconButton>
          </TablePagination>
        </>
      ) : (
        "Получаем данные..."
      )}
    </Container>
  );
};

const Container = styled.div`
  table {
    font-size: 14px;
    border-collapse: collapse;
    width: 100%;

    th,
    td {
      padding: 10px;
    }

    tbody {
      tr {
        border-bottom: 1px solid #d8d8d8;
      }
    }

    thead {
      tr {
        th {
          font-weight: 500;
          background: #d8d8d8;
          text-align: left;
          position: sticky;
          top: 0;
          z-index: 1;
          white-space: nowrap;

          :first-child {
            border-top-left-radius: 5px;
          }

          :last-child {
            border-top-right-radius: 5px;
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    table {
      display: inline-block;
      overflow: auto;
      padding-left: 15px;
    }
  }
`;

const TablePaginationIconButton = styled.div`
  ${({ isDisabled }) => isDisabled && "visibility: hidden"};
`;

const TablePagination = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;

  > div {
    display: flex;
    align-items: center;
    column-gap: 10px;

    > span {
      :nth-child(2) {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        border: 1px solid grey;
        border-radius: 5px;
        padding: 0 10px;
      }
    }
  }

  @media (hover: hover) {
    svg {
      cursor: pointer;
    }
  }
`;
