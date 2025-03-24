import React from "react";
import styled from "styled-components";
import Button from "../../../../nekrasovka-ui/Button";

const ERROR_STYLES = { color: "rgb(163, 98, 87)" };
const ERROR_TEXTS = {
  NOT_FOUND: "Не найдена в ОПАК",
  MISSING: "Отсутствует в выборке инвентарных номеров",
};

const getBookRowData = (book) => {
  const isError = book.status === 6 || book.status === null;
  const errorText =
    book.status === 6
      ? ERROR_TEXTS.NOT_FOUND
      : book.status === null
        ? ERROR_TEXTS.MISSING
        : "";

  const bookClass = book.status === 4 ? "selected" : "";
  const bookCheck = book.status === 4 ? "V" : "";

  return {
    isError,
    bookClass,
    bookCheck,
    style: isError ? ERROR_STYLES : {},
    errorText,
  };
};

export default ({ books, setBooks, handleCheckBooks }) => {
  const updateBookStatus = (book, id) => {
    if (book.id !== id) return book;

    book.prevStatus ??= book.status; // Use nullish coalescing for brevity
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
              const { isError, bookClass, bookCheck, style, errorText } =
                getBookRowData(book);
              return (
                <tr key={dataIndex} style={style}>
                  <td>{book.identificator}</td>
                  <td>{book.name}</td>
                  <td>{book.search_term}</td>
                  <td>
                    {isError ? (
                      errorText
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
