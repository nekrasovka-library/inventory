import React from "react";
import Button from "../../../../nekrasovka-ui/Button";
import styled from "styled-components";

export default ({ books, handleBook, setBooks, handleCheckBooks }) => {
  const toggleBookStatus = (id, status) => {
    const updatedBooks = books.map((book) => {
      if (book.id === id) {
        return { ...book, status: book.status === 4 ? 2 : 4 };
      } else return book;
    });

    setBooks(updatedBooks);
    handleBook(id, status);
  };

  return (
    <Table>
      <div>
        <table>
          <thead>
            <tr>
              <th>Идентификатор</th>
              <th>Описание из АБИС</th>
              <th>Инвентарный номер</th>
              <th>Отметка о наличии</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, dataIndex) => {
              let dataItemClass = "";
              let dataItemText = "";
              let style = {};

              const isBookStatusFound = book.status === 4;
              const isBookStatusFailedToLoad = book.status === 6;

              if (isBookStatusFound) {
                dataItemClass = "selected";
                dataItemText = "V";
              }

              if (isBookStatusFailedToLoad) {
                style = { color: "red" };
              }

              return (
                <tr key={dataIndex} style={style}>
                  <td>{book.identificator}</td>
                  <td>{book.name}</td>
                  <td>{book.search_term}</td>
                  <td>
                    {isBookStatusFailedToLoad ? (
                      "Не найдена в ОПАК"
                    ) : (
                      <div
                        className={dataItemClass}
                        onClick={() => toggleBookStatus(book.id, book.status)}
                      >
                        {dataItemText}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!!books.length && (
        <div>
          <Button
            name="Очистить список"
            onClick={handleCheckBooks}
            buttonStyles={"margin-top: 20px;"}
          />
        </div>
      )}
    </Table>
  );
};

const Table = styled.div`
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

        &.disabled {
          opacity: 0.5;
        }

        td {
          :last-child {
            > div {
              height: 20px;
              width: 20px;
              border: 1px solid #d8d8d8;
              cursor: pointer;

              &.selected {
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 500;
                background-color: #d8d8d8;
              }

              @media (hover: hover) {
                :hover {
                  background-color: #d8d8d8;
                }
              }
            }
          }
        }
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
