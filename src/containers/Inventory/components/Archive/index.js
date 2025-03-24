import React, { Fragment, useEffect } from "react";
import styled from "styled-components";
import ArchiveStats from "./components/ArchiveStats";

export default ({
  handleArchive,
  setSelectedArchive,
  getArchive,
  setArchive,
  archive,
  selectedArchiveId,
  setSelectedArchiveId,
  selectedArchive,
  exportINITIAL,
  exportPENDING,
}) => {
  const onClick = (id) => {
    if (selectedArchive.loaded) {
      setSelectedArchive({ loaded: false });
    }

    if (selectedArchiveId === id) {
      setSelectedArchiveId("");
    } else {
      setSelectedArchiveId(id);
      handleArchive(id);
    }
  };

  const clearArchive = () => {
    setArchive({ data: [], loaded: false });
    setSelectedArchive({ loaded: false });
    setSelectedArchiveId("");
  };

  useEffect(() => {
    getArchive();

    return () => clearArchive();
  }, []);

  return (
    <Container isArchiveId={selectedArchive.loaded}>
      {archive.loaded ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Дата начала</th>
                <th>Дата окончания</th>
              </tr>
            </thead>
            <tbody>
              {archive.data.map((dataItem) => {
                let selected = "";

                if (selectedArchiveId === dataItem.id) {
                  selected = "selected";
                }

                return (
                  <Fragment key={dataItem.id}>
                    <tr
                      className={selected}
                      onClick={() => onClick(dataItem.id)}
                    >
                      <td>{dataItem.name}</td>
                      <td>{dataItem.date.created_at}</td>
                      <td>{dataItem.date.updated_at}</td>
                    </tr>
                    {selectedArchive.loaded &&
                      selectedArchiveId === dataItem.id && (
                        <ArchiveStats
                          id={selectedArchiveId}
                          owner={selectedArchive.owner}
                          pending={selectedArchive.pending}
                          total={selectedArchive.total}
                          difference={selectedArchive.difference}
                          exportINITIAL={exportINITIAL}
                          exportPENDING={exportPENDING}
                        />
                      )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
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
        cursor: pointer;

        &:not(.selected, .archive_stats) {
          border-bottom: 1px solid #d8d8d8;

          @media (hover: hover) {
            :hover {
              background-color: #40677e;
              color: #ffff;
            }
          }
        }

        &.selected {
          background-color: #40677e;
          color: #ffff;

          ${({ isArchiveId }) =>
            isArchiveId && "+ tr {border-bottom: 1px solid #40677e;}"};
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
