import { useState } from "react";

import { GlobeAsiaAustraliaIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Outlet } from "@tanstack/react-router";

import styled from "styled-components";

import { useMediaQuery } from "src/hooks/useMediaQuery";

import DashboardHeader from "src/components/Molecules/ComposedAsFeatures/DashboardHeader";
import DesktopSidebar from "../Organisms/Sidebar/DesktopSidebar";
import MobileSidebar from "../Organisms/Sidebar/MobileSidebar";

const StyledAppLayout = styled.div`
  display: flex;
  height: 100vh;
  background-color: var(--color-grey-50);
`;

const MainContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevents content from overflowing */
`;

const Main = styled.main<{ $isSidebarExpanded?: boolean }>`
  flex: 1; /* Grow to fill available space */
  padding: 2.4rem 1.6rem 4.8rem;
  overflow-y: auto;

  @media (min-width: 1024px) {
    ${(props) =>
      !props.$isSidebarExpanded
        ? `
      padding: 4rem 2.4rem 6.4rem 10.7rem;
    `
        : `
      padding: 4rem 2.4rem 6.4rem 2.4rem;
    `}
  }
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const TemplateApp = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const menuItems = [
    {
      id: "dashboard",
      label: "Home",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      id: "tours",
      label: "Tours",
      href: "/tours",
      icon: GlobeAsiaAustraliaIcon,
    },
  ];

  return (
    <StyledAppLayout>
      {isDesktop ? (
        <DesktopSidebar
          isPermanentlyExpanded={isSidebarExpanded}
          menuItems={menuItems}
          onToggle={() => setIsSidebarExpanded((prev) => !prev)}
        />
      ) : (
        <MobileSidebar
          isOpened={isMobileSidebarOpen}
          menuItems={menuItems}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <MainContentWrapper>
        <DashboardHeader
          isSidebarExpanded={isSidebarExpanded}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />
        <Main $isSidebarExpanded={isSidebarExpanded}>
          <Container>
            <Outlet />
          </Container>
        </Main>
      </MainContentWrapper>
    </StyledAppLayout>
  );
};

export default TemplateApp;
