import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

const ProgressBarContainer = styled.div`
  position: absolute;
  top: 0;
  transition: width 300ms linear;
  height: 5px;
  z-index: 20000;
  background-color: #ffad20;
  width: ${({ progress }) => progress}%;
`;

const ProgressBar = ({ progress }) => {
  const [completed, setCompleted] = useState(progress);

  useEffect(() => {
    let timer = setTimeout(
      () => setCompleted(completed + Math.floor(Math.random() * 10)),
      500,
    );

    return () => clearTimeout(timer);
  }, [completed]);

  return <ProgressBarContainer progress={completed} />;
};

const mapStateToProps = ({ progress: { progress } }) => ({
  progress,
});

export default connect(mapStateToProps)(ProgressBar);
