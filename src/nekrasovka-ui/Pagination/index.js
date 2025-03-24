import React, { useEffect, useState } from "react";
import styled from "styled-components";

export default ({ className, countPages, getPaginated }) => {
  const [activePage, setActivePage] = useState(1);

  const keyDown = ({ key }) => {
    const next = activePage !== countPages;
    const prev = activePage !== 1;

    switch (key) {
      case "ArrowRight":
        next && onNextPageClick();
        break;
      case "ArrowLeft":
        prev && onPrevPageClick();
        break;
      default:
        break;
    }
  };

  const onPrevPageClick = () => {
    if (activePage > 1) {
      const prev = activePage - 1;

      setActivePage(prev);
      getPaginated(prev);
    }
  };

  const onNextPageClick = () => {
    if (activePage < countPages) {
      const next = activePage + 1;

      setActivePage(next);
      getPaginated(next);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyDown);
    return () => document.removeEventListener("keydown", keyDown);
  });

  const isNext = activePage !== countPages;
  const isPrev = activePage !== 1;

  return (
    <Pagination className={className}>
      <i
        onClick={onPrevPageClick}
        className={`fa fa-long-arrow-left ${isPrev ? "" : "fa_disabled"}`}
        aria-hidden="true"
      />
      <PaginationCount>
        <div>
          <span>Стр.</span>
          {activePage}
        </div>
        <div>
          <span>из</span>
          {countPages}
        </div>
      </PaginationCount>
      <i
        onClick={onNextPageClick}
        className={`fa fa-long-arrow-right ${isNext ? "" : "fa_disabled"}`}
        aria-hidden="true"
      />
    </Pagination>
  );
};

const Pagination = styled.div`
  display: flex;
  align-items: center;
  column-gap: 20px;

  .fa {
    :not(.fa_disabled) {
      cursor: pointer;
    }

    &.fa_disabled {
      color: #c4c4c4;
    }
  }

  @media (min-width: 769px) {
    padding: 15px 0;
  }

  @media (max-width: 768px) {
    padding: 15px;
    justify-content: space-between;
  }
`;

const PaginationCount = styled.div`
  display: flex;
  column-gap: 10px;
  align-items: center;

  > div {
    font-weight: 300;
    display: flex;

    :nth-child(1) {
      span {
        margin-right: 3px;
      }
    }

    :nth-child(2) {
      opacity: 0.6;

      span {
        margin-right: 10px;
      }
    }
  }
`;
