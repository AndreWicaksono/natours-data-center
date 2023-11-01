import { Link } from "@tanstack/react-router";

import styled from "styled-components";

import { GlobeAsiaAustraliaIcon, HomeIcon } from "@heroicons/react/24/outline";

import Logo from "src/components/Molecules/Logo";
import NavigationMenus from "src/components/Molecules/NavigationMenus";
import { ReactNode } from "react";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);
  box-shadow: var(--shadow-md);

  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const NavLinkThemeNatours = styled(Link)`
  position: relative;

  border-radius: var(--border-radius-sm);

  .bg-image-brand {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;

    background-image: linear-gradient(
      to bottom right,
      rgba(125, 213, 111, 0.85),
      rgba(40, 180, 135, 0.85)
    );
    border-radius: var(--border-radius-sm);
    transition: all 0.3s ease-in;
    opacity: 0;

    &:hover {
      opacity: 1;
    }

    & > div {
      display: flex;
      align-items: center;

      gap: 1.2rem;
      padding: 1.2rem 2.4rem;
    }
  }

  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    color: var(--color-green-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-image: linear-gradient(
      to bottom right,
      rgba(125, 213, 111, 0.85),
      rgba(40, 180, 135, 0.85)
    );

    background-position: center;
    background-size: cover;
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover {
    span,
    svg {
      color: #fff;
      transition: all 0.3s;
      z-index: 1;
    }
  }

  &.active {
    span,
    svg {
      color: #fff;
    }
  }
`;

const Sidebar = () => {
  const menus: Array<{ id: string; element: ReactNode }> = [
    {
      id: "navLinkDashboard",
      element: (
        <NavLinkThemeNatours to="/dashboard" preload={false}>
          <div className="bg-image-brand" />

          <HomeIcon height={24} width={24} />

          <span>Home</span>
        </NavLinkThemeNatours>
      ),
    },

    {
      id: "navLinkTours",
      element: (
        <NavLinkThemeNatours to="/tours" preload={false}>
          <div className="bg-image-brand" />

          <GlobeAsiaAustraliaIcon height={24} width={24} />

          <span>Tours</span>
        </NavLinkThemeNatours>
      ),
    },
  ];

  return (
    <StyledSidebar>
      <Logo />

      <NavigationMenus data={menus} useDefaultThemeLink={false} />
    </StyledSidebar>
  );
};

export default Sidebar;
