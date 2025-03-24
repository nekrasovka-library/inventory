import React, { useEffect, useRef } from "react";
import styled from "styled-components";

export default ({
  setIsContentModal,
  isContentModal,
  contentModalStyle,
  children,
  className,
}) => {
  const contentModalRef = useRef(null);
  const handleOutOfContentModal = ({ target }) => {
    const isOutOfContentModal =
      !contentModalRef.current.contains(target) &&
      typeof target.parentNode.className === "string";

    if (isOutOfContentModal) setIsContentModal(!isContentModal);
  };

  useEffect(() => {
    if (isContentModal) {
      window.addEventListener("click", handleOutOfContentModal);
    }

    return () => window.removeEventListener("click", handleOutOfContentModal);
  }, [isContentModal]);

  return (
    <ContentModal
      className={className}
      contentModalStyle={contentModalStyle}
      isContentModal={isContentModal}
      ref={contentModalRef}
    >
      <div>{children}</div>
    </ContentModal>
  );
};

const ContentModal = styled.div`
  display: ${({ isContentModal }) => (isContentModal ? "flex" : "none")};
  z-index: 1;

  &,
  > div::after {
    box-shadow: 0 0 7px rgb(0 0 0 / 27%);
    position: absolute;
  }

  > div,
  > div::after {
    background: #ffffff;
  }

  > div {
    position: relative;
    height: 100%;
    width: 100%;

    ::after {
      content: "";
      right: calc(250px / 2 - 7.5px);
      top: -7px;
      width: 15px;
      height: 15px;
      z-index: -1;
      transform: rotate(45deg);
    }
  }

  ${({ contentModalStyle }) => contentModalStyle}
`;
