import { Outlet } from "@tanstack/react-router";

import styled from "styled-components";

import DashboardHeader from "src/components/Molecules/ComposedAsFeatures/DashboardHeader";
import DashboardSidebar from "src/components/Organisms/ComposedAsFeatures/DashboardSidebar";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
  overflow: visible;
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const TemplateApp = () => {
  return (
    <StyledAppLayout>
      <DashboardHeader />

      <DashboardSidebar />

      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
};

export default TemplateApp;
