import React, { useContext, useEffect } from "react";
import styled from "styled-components";

import Routes from "../../routes";
import { connect } from "react-redux";
import { getAllowance } from "../../reducers/allowance/actions";
import { KeycloakContext } from "../../nekrasovka-ui/react-keycloak-nekrasovka";
import ProgressBar from "../../components/ProgressBar";

const MainContainer = styled.main`
  margin: 0 auto 100px;
  max-width: 1218px;
  height: 100%;
`;

const Main = ({ getAllowance, isAllowanceLoading, show }) => {
  const kc = useContext(KeycloakContext);

  useEffect(() => {
    if (isAllowanceLoading) return;

    getAllowance({ ...kc });
  }, [isAllowanceLoading]);

  return (
    <>
      {show && <ProgressBar />}
      <MainContainer>
        <Routes />
      </MainContainer>
    </>
  );
};

const mapStateToProps = ({
  progress: { show },
  allowance: { isAllowanceLoading },
}) => ({
  isAllowanceLoading,
  show,
});

export default connect(mapStateToProps, {
  getAllowance,
})(Main);
