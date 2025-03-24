import React from "react";
import styled from "styled-components";

const SeparatorContainer = styled.div`
  & {
    height: 0.5px;
    background-color: #c4c4c4;
    max-width: 1218px;

    ${(props) => props.separatorStyle};
  }
`;

export default ({ separatorStyle, className }) => (
  <SeparatorContainer separatorStyle={separatorStyle} className={className} />
);
