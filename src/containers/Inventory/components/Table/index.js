import React from "react";
import Button from "../../../../nekrasovka-ui/Button";
import styled from "styled-components";

const FOUND = 4;
const PENDING = 2;

export default ({ books, setBooks, handleCheckBooks }) => {
  const updateBookStatus = (book, id) => {
    if (book.id !== id) return book;

    if (book.prevStatus === undefined) {
      book.prevStatus = book.status;
    }

    book.status = book.status === FOUND ? PENDING : FOUND;

    if (book.status === book.prevStatus) {
      delete book.prevStatus;
    }

    return book;
  };

  const toggleBookStatus = (id) => {
    const updatedBooks = books.map((book) => updateBookStatus(book, id));
    setBooks(updatedBooks);
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
              let isError = false;
              let bookClass = "";
              let bookCheck = "";

              const error = {
                style: { color: "rgb(163, 98, 87)" },
                text: "",
              };

              if (book.status === 4) {
                bookClass = "selected";
                bookCheck = "V";
              }

              if (book.status === 6) {
                isError = true;
                error.text = "Не найдена в ОПАК";
              }

              if (book.status === null) {
                isError = true;
                error.text = "Отсутствует в выборке инвентарных номеров";
              }

              const style = isError ? error.style : {};

              return (
                <tr key={dataIndex} style={style}>
                  <td>{book.identificator}</td>
                  <td>{book.name}</td>
                  <td>{book.search_term}</td>
                  <td>
                    {isError ? (
                      error.text
                    ) : (
                      <div
                        className={bookClass}
                        onClick={() => toggleBookStatus(book.id)}
                      >
                        {bookCheck}
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
            name="Отметить наличие"
            onClick={handleCheckBooks}
            buttonStyles={"margin-top: 40px;"}
          />
        </div>
      )}
    </Table>
  );
};

const Table = styled.div`
  & > div {
    :last-child {
      display: flex;
      justify-content: flex-end;
    }
  }

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
