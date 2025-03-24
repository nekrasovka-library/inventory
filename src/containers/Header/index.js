import React, { useContext } from "react";
import styled from "styled-components";
import Icon from "../../nekrasovka-ui/Icon";
import Section from "../../nekrasovka-ui/Section";
import { KeycloakContext } from "../../nekrasovka-ui/react-keycloak-nekrasovka";

import { connect } from "react-redux";

const Header = ({ name }) => {
  const { onExit, user } = useContext(KeycloakContext);

  return (
    <HeaderContainer>
      <HeaderSection>
        <Icon icon="logoNekrasovka" fill="#222222" height={24} />
        <HeaderName>
          <div>
            <img
              src={`https://filin.mail.ru/pic?from=ph&email=${user}&width=180&height=180`}
              alt=""
            />
            {name}
          </div>
          <HeaderExit onClick={onExit}>
            <Icon icon="exit" fill="#777777ff" height={12} width="100%" />
          </HeaderExit>
        </HeaderName>
      </HeaderSection>
    </HeaderContainer>
  );
};

const mapStateToProps = ({ allowance: { name } }) => ({
  name,
});

export default connect(mapStateToProps)(Header);

const HeaderExit = styled.div`
  display: flex;
  cursor: pointer;
  border-radius: 50%;
  height: 24px;
  width: 24px;
  align-items: center;
  border: 1px solid rgb(221, 219, 207);

  @media (hover: hover) {
    :hover {
      background-color: rgb(221, 219, 207);
    }
  }
`;

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 40px;
  background-color: #dddbcfff;
  padding-top: 8px;
  padding-bottom: 8px;

  @media (max-width: 768px) {
    padding-left: 15px;
    padding-right: 15px;
  }
`;

const HeaderSection = styled(Section)`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  max-width: 1218px;
  margin: 0 auto;
  column-gap: 20px;
  width: 100%;
  height: 100%;
`;

const HeaderName = styled.div`
  display: flex;
  align-items: center;
  column-gap: 20px;
  align-self: center;
  color: #777777ff;

  > div {
    :nth-child(1) {
      column-gap: 5px;
      display: flex;
      align-items: center;

      img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }
    }
  }

  @media (min-width: 769px) {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;
