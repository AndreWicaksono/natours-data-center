"use client";

import {
  DetailedHTMLProps,
  FC,
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
  SVGProps,
  useState,
} from "react";

import { Link, useRouterState } from "@tanstack/react-router";
import styled, { css, keyframes } from "styled-components";

import NatoursLogoFull from "src/assets/SVG/logo-green-small-2x.svg";
import { useHasCursor } from "src/hooks/useHasCursor";

// ─── Animations ───────────────────────────────────────────────────────────────

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

export const EXPANDED_WIDTH = "28rem"; // 280px
export const COLLAPSED_WIDTH = "8rem"; // 80px

// ─── Type Definitions ─────────────────────────────────────────────────────────

export interface SidebarMenuItem_Object {
  id: string;
  label: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & RefAttributes<SVGSVGElement>
  >;
  badge?: number;
}

// ─── Styled Components ────────────────────────────────────────────────────────

const SidebarWrapper = styled.div<{
  $sidebarWidth: string;
  $sidebarPosition: string;
}>`
  flex-shrink: 0;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: ${(props) => props.$sidebarWidth};
  ${(props) => props.$sidebarPosition}

  @media (prefers-reduced-motion: reduce) {
    transition: width 0.1s ease;
  }
`;

const SidebarContainer = styled.aside`
  position: sticky;
  top: 0;
  left: 0;
  height: 100dvh;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: width 0.1s ease;
  }
`;

const SidebarContent = styled.div<{ $isCurrentlyExpanded: boolean }>`
  display: flex;
  height: 100%;
  flex-direction: column;

  /* Enhanced border */
  border-right: 1px solid var(--color-grey-200);

  /* Subtle gradient background */
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(249, 250, 251, 1) 100%
  );

  /* Subtle inner shadow */
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.5);

  width: ${(props) =>
    props.$isCurrentlyExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH};

  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: width 0.1s ease;
  }
`;

// ─── Header ───────────────────────────────────────────────────────────────────

const Header = styled.div<{ $isCurrentlyExpanded: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  padding: 2rem 1.6rem 3.2rem 1.6rem;
  justify-content: ${(props) =>
    props.$isCurrentlyExpanded ? "space-between" : "center"};

  /* Subtle bottom border */
  border-bottom: 1px solid var(--color-grey-100);

  @media (max-width: 1279px) {
    padding: 1.8rem 1.4rem 2.8rem 1.4rem;
  }
`;

const Logo = styled.img<{ $isCurrentlyExpanded: boolean }>`
  height: ${(props) => (props.$isCurrentlyExpanded ? "3.6rem" : "4rem")};
  width: ${(props) => (props.$isCurrentlyExpanded ? "auto" : "4rem")};
  object-fit: contain;

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// ─── Navigation ───────────────────────────────────────────────────────────────

const Nav = styled.nav<{ $isCurrentlyExpanded: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${(props) =>
    props.$isCurrentlyExpanded ? "1.6rem 1.2rem" : "1.6rem 1rem"};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 0.4rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-300);
    border-radius: 0.2rem;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-grey-400);
  }
`;

// ─── Tooltip ──────────────────────────────────────────────────────────────────

const Tooltip = styled.div`
  position: absolute;
  left: calc(100% + 1.2rem);
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;

  padding: 0.8rem 1.2rem;

  border-radius: 0.8rem;
  background: var(--color-grey-900);

  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.1);

  font-size: 1.3rem;
  font-weight: 500;
  white-space: nowrap;
  color: white;

  opacity: 0;
  pointer-events: none;

  transition: opacity 0.2s ease;

  /* Arrow */
  &::before {
    content: "";
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);

    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0.6rem 0.6rem 0.6rem 0;
    border-color: transparent var(--color-grey-900) transparent transparent;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// ─── Nav Item ─────────────────────────────────────────────────────────────────

const NavItem = styled(Link)<{
  $isActive: boolean;
  $isCurrentlyExpanded: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;

  border-radius: 1rem;
  text-decoration: none;

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  padding: 1.2rem;

  ${(props) =>
    props.$isCurrentlyExpanded
      ? css`
          justify-content: space-between;
        `
      : css`
          justify-content: center;
        `}

  /* Active state */
  ${(props) =>
    props.$isActive
      ? css`
          background: linear-gradient(
            135deg,
            var(--color-brand-500) 0%,
            var(--color-brand-600) 100%
          );
          color: white;
          box-shadow:
            0 4px 12px rgba(40, 180, 133, 0.25),
            0 2px 4px rgba(40, 180, 133, 0.15);
        `
      : css`
          background-color: transparent;
          color: var(--color-grey-700);
        `}

  /* Hover state */
  &:hover {
    ${(props) =>
      props.$isActive
        ? css`
            background: linear-gradient(
              135deg,
              var(--color-brand-600) 0%,
              var(--color-brand-700) 100%
            );
            transform: translateY(-1px);
            box-shadow:
              0 6px 16px rgba(40, 180, 133, 0.3),
              0 2px 6px rgba(40, 180, 133, 0.2);
          `
        : css`
            background-color: var(--color-grey-100);
            transform: translateX(2px);
          `}

    /* Show tooltip on hover when collapsed */
    ${(props) =>
      !props.$isCurrentlyExpanded &&
      css`
        & > ${Tooltip} {
          opacity: 1;
        }
      `}
  }

  &:active {
    transform: scale(0.98);
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      background 0.1s ease,
      color 0.1s ease;

    &:hover,
    &:active {
      transform: none;
    }
  }
`;

const NavItemContent = styled.div<{ $isCurrentlyExpanded: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.$isCurrentlyExpanded ? "1.2rem" : "0")};
`;

const NavIcon = styled.div<{ $isActive: boolean }>`
  display: inline-flex;
  flex-shrink: 0;

  .icon {
    height: 2.4rem;
    width: 2.4rem;
    stroke-width: 2;
    color: ${(props) => (props.$isActive ? "white" : "var(--color-grey-600)")};
    transition: color 0.2s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    .icon {
      transition: none;
    }
  }
`;

const NavLabel = styled.span<{ $isActive: boolean }>`
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1.4;
  color: ${(props) => (props.$isActive ? "white" : "var(--color-grey-700)")};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  transition: color 0.2s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// ─── Badge ────────────────────────────────────────────────────────────────────

const Badge = styled.span<{ $isActive: boolean }>`
  display: flex;
  min-width: 2.4rem;
  height: 2.4rem;

  align-items: center;
  justify-content: center;

  padding: 0 0.6rem;

  border-radius: 10rem;

  ${(props) =>
    props.$isActive
      ? css`
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
        `
      : css`
          background: linear-gradient(
            135deg,
            var(--color-brand-100) 0%,
            var(--color-brand-200) 100%
          );
          color: var(--color-brand-800);
        `}

  font-size: 1.2rem;
  font-weight: 600;

  animation: ${pulse} 2s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const TooltipBadge = styled.span`
  margin-left: 0.8rem;
  padding: 0.2rem 0.6rem;

  border-radius: 0.4rem;
  background: rgba(255, 255, 255, 0.2);

  font-size: 1.2rem;
  font-weight: 600;
  color: white;
`;

// ─── Toggle Buttons ───────────────────────────────────────────────────────────

// Original circle toggle for header (cursor devices)
const StyledToggleButton = styled.button<{ $isCurrentlyExpanded?: boolean }>`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 9999px;
  padding: 0.4rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-neutral-100, #f8f8f8);
  }

  .toggle-icon {
    stroke: var(--color-primary-500, #28b485);
    .inner-circle {
      fill: var(--color-primary-500, #28b485);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// Floating arrow button for touch devices only
const FloatingToggleButton = styled.button`
  position: absolute;
  top: 2.4rem;
  right: -1.6rem;
  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 3.2rem;
  height: 3.2rem;

  background: white;
  border: 2px solid var(--color-brand-400);
  border-radius: 50%;

  cursor: pointer;

  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: var(--color-brand-50);
    border-color: var(--color-brand-500);
    transform: scale(1.1);
    box-shadow:
      0 6px 16px rgba(0, 0, 0, 0.15),
      0 2px 6px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: scale(0.95);
  }

  .arrow-icon {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-brand-600);
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      background 0.1s ease,
      border-color 0.1s ease;

    &:hover,
    &:active {
      transform: none;
    }
  }
`;

// Original circle toggle button component
const ToggleButton: FC<{
  isPermanentlyExpanded: boolean;
  isCurrentlyExpanded?: boolean;
  onClick?: () => void;
}> = ({ isPermanentlyExpanded, isCurrentlyExpanded, onClick }) => {
  return (
    <StyledToggleButton
      onClick={onClick}
      $isCurrentlyExpanded={isCurrentlyExpanded}
      title={isPermanentlyExpanded ? "Collapse sidebar" : "Expand sidebar"}
      aria-label={isPermanentlyExpanded ? "Collapse sidebar" : "Expand sidebar"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="toggle-icon"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
        {isPermanentlyExpanded && (
          <circle cx="12" cy="12" r="3" className="inner-circle" />
        )}
      </svg>
    </StyledToggleButton>
  );
};

// Floating arrow button component (touch devices only)
const FloatingToggle: FC<{
  onClick?: () => void;
}> = ({ onClick }) => {
  return (
    <FloatingToggleButton
      onClick={onClick}
      title="Expand sidebar"
      aria-label="Expand sidebar"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="arrow-icon"
      >
        <path d="M9 18l6-6-6-6" stroke="currentColor" />
      </svg>
    </FloatingToggleButton>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────

// const Footer = styled.div<{ $isCurrentlyExpanded: boolean }>`
//   padding: 1.6rem;
//   border-top: 1px solid var(--color-grey-100);

//   ${(props) =>
//     !props.$isCurrentlyExpanded &&
//     css`
//       display: flex;
//       justify-content: center;
//     `}
// `;

// ─── Main Component ───────────────────────────────────────────────────────────

interface DesktopSidebarProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  isPermanentlyExpanded?: boolean;
  menuItems: SidebarMenuItem_Object[];
  onToggle?: () => void;
}

const DesktopSidebar: FC<DesktopSidebarProps> = ({
  className,
  menuItems,
  isPermanentlyExpanded = true,
  onToggle,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { location } = useRouterState();
  const pathname = location.pathname;

  // Detect if device has cursor (mouse) capability
  const hasCursor = useHasCursor();

  const isExpanded =
    isPermanentlyExpanded || (!isPermanentlyExpanded && isHovered);
  const isCurrentlyExpanded = isExpanded;
  const isOverlayMode = !isPermanentlyExpanded;
  const sidebarPosition = isOverlayMode
    ? "position: fixed; top: 0; left: 0; z-index: 50;"
    : "position: relative;";
  const sidebarWidth = isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  // Only enable hover expand on devices with cursor
  const handleMouseEnter = () => {
    if (!isPermanentlyExpanded && hasCursor) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (hasCursor) {
      setIsHovered(false);
    }
  };

  // For touch devices, show floating toggle button when collapsed
  const showFloatingToggle =
    !hasCursor && !isPermanentlyExpanded && !isExpanded;

  return (
    <SidebarWrapper
      $sidebarWidth={sidebarWidth}
      $sidebarPosition={sidebarPosition}
      className={className}
      {...props}
    >
      <SidebarContainer
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SidebarContent $isCurrentlyExpanded={isCurrentlyExpanded}>
          {/* Header */}
          <Header $isCurrentlyExpanded={isCurrentlyExpanded}>
            <Logo
              alt="Natours Logo"
              $isCurrentlyExpanded={isCurrentlyExpanded}
              src={isCurrentlyExpanded ? NatoursLogoFull : "/SVG/favicon.svg"}
            />

            {/* Original circle toggle button (when expanded) */}
            {isCurrentlyExpanded && (
              <ToggleButton
                isPermanentlyExpanded={isPermanentlyExpanded}
                isCurrentlyExpanded={isCurrentlyExpanded}
                onClick={onToggle}
              />
            )}
          </Header>

          {/* Floating arrow toggle button (touch devices only, when collapsed) */}
          {showFloatingToggle && <FloatingToggle onClick={onToggle} />}

          {/* Navigation */}
          <Nav $isCurrentlyExpanded={isCurrentlyExpanded}>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <NavItem
                  key={item.id}
                  to={item.href}
                  $isActive={isActive}
                  $isCurrentlyExpanded={isCurrentlyExpanded}
                >
                  <NavItemContent $isCurrentlyExpanded={isCurrentlyExpanded}>
                    <NavIcon $isActive={isActive}>
                      <Icon className="icon" />
                    </NavIcon>
                    {isCurrentlyExpanded && (
                      <NavLabel $isActive={isActive}>{item.label}</NavLabel>
                    )}
                  </NavItemContent>

                  {isCurrentlyExpanded && item.badge && (
                    <Badge $isActive={isActive}>{item.badge}</Badge>
                  )}

                  {!isCurrentlyExpanded && (
                    <Tooltip>
                      {item.label}
                      {item.badge && <TooltipBadge>{item.badge}</TooltipBadge>}
                    </Tooltip>
                  )}
                </NavItem>
              );
            })}
          </Nav>
        </SidebarContent>
      </SidebarContainer>
    </SidebarWrapper>
  );
};

export default DesktopSidebar;
