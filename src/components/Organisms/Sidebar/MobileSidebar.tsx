"use client";

import {
  DetailedHTMLProps,
  FC,
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
  SVGProps,
  useEffect,
  useRef,
} from "react";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useRouterState } from "@tanstack/react-router";
import styled, { keyframes } from "styled-components";

import NatoursLogo from "src/assets/SVG/logo-green-small-2x.svg";

// ─── Animations ───────────────────────────────────────────────────────────────

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

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

const Overlay = styled.div<{ $isOpened: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 50;

  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);

  opacity: ${(props) => (props.$isOpened ? 1 : 0)};
  pointer-events: ${(props) => (props.$isOpened ? "auto" : "none")};

  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (prefers-reduced-motion: reduce) {
    backdrop-filter: none;
    transition: opacity 0.1s ease;
  }
`;

const SidebarContainer = styled.aside<{ $isOpened: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 50;

  display: flex;
  flex-direction: column;

  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform: ${(props) =>
    props.$isOpened ? "translateX(0)" : "translateX(-100%)"};

  @media (prefers-reduced-motion: reduce) {
    transition: transform 0.2s ease;
  }
`;

const SidebarContent = styled.div`
  min-height: 100dvh;
  width: 32rem; /* 320px - slightly wider for better touch targets */
  max-width: 85vw; /* Don't take full screen on very small devices */

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(249, 250, 251, 1) 100%
  );

  /* Enhanced shadow */
  box-shadow:
    4px 0 24px rgba(0, 0, 0, 0.12),
    2px 0 8px rgba(0, 0, 0, 0.08);

  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    width: 28rem; /* 280px on very small screens */
  }
`;

// ─── Header ───────────────────────────────────────────────────────────────────

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 2rem 2rem 2.4rem 2rem;

  border-bottom: 1px solid var(--color-grey-200);

  /* Subtle gradient background */
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(249, 250, 251, 0.5) 100%
  );

  @media (max-width: 480px) {
    padding: 1.8rem 1.6rem 2rem 1.6rem;
  }
`;

const Logo = styled.img`
  height: 3.6rem;
  width: auto;
  object-fit: contain;

  @media (max-width: 480px) {
    height: 3.2rem;
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 4rem;
  height: 4rem;

  background: transparent;
  border: 1px solid var(--color-grey-300);
  border-radius: 1rem;

  cursor: pointer;

  color: var(--color-grey-700);

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  svg {
    width: 2.4rem;
    height: 2.4rem;
  }

  &:hover {
    background: var(--color-grey-100);
    border-color: var(--color-grey-400);
    color: var(--color-grey-900);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 480px) {
    width: 3.6rem;
    height: 3.6rem;

    svg {
      width: 2.2rem;
      height: 2.2rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      background 0.1s ease,
      border-color 0.1s ease;

    &:active {
      transform: none;
    }
  }
`;

// ─── Navigation ───────────────────────────────────────────────────────────────

const Nav = styled.nav`
  flex: 1;

  padding: 2rem 1.6rem;

  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  overflow-y: auto;
  overflow-x: hidden;

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

  @media (max-width: 480px) {
    padding: 1.6rem 1.2rem;
    gap: 0.6rem;
  }
`;

const NavItem = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;

  padding: 1.4rem 1.6rem;

  border-radius: 1.2rem;
  text-decoration: none;

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  /* Active state */
  ${(props) =>
    props.$isActive
      ? `
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
      : `
    background-color: transparent;
    color: var(--color-grey-700);
  `}

  /* Hover state */
  &:hover {
    ${(props) =>
      props.$isActive
        ? `
      background: linear-gradient(
        135deg,
        var(--color-brand-600) 0%,
        var(--color-brand-700) 100%
      );
      transform: translateX(4px);
    `
        : `
      background-color: var(--color-grey-100);
      transform: translateX(4px);
    `}
  }

  &:active {
    transform: scale(0.98) translateX(2px);
  }

  @media (max-width: 480px) {
    padding: 1.2rem 1.4rem;
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

const NavItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4rem;
`;

const NavIcon = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 1.4;
  color: ${(props) => (props.$isActive ? "white" : "var(--color-grey-700)")};

  transition: color 0.2s ease;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }

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
      ? `
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
  `
      : `
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

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = styled.div`
  padding: 1.6rem;
  border-top: 1px solid var(--color-grey-200);

  background: linear-gradient(
    180deg,
    rgba(249, 250, 251, 0.5) 0%,
    rgba(255, 255, 255, 1) 100%
  );
`;

const FooterText = styled.p`
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: center;
  margin: 0;
  line-height: 1.5;
`;

// ─── Main Component ───────────────────────────────────────────────────────────

const MobileSidebar: FC<
  {
    isOpened: boolean;
    menuItems: SidebarMenuItem_Object[];
    onClose: () => void;
  } & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
> = ({ className, isOpened, menuItems, onClose, ...props }) => {
  const { location } = useRouterState();
  const pathname = location.pathname;

  const refSidebar = useRef<HTMLDivElement | null>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpened &&
        refSidebar.current &&
        event.target instanceof Node &&
        !refSidebar.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpened, onClose]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpened]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpened) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpened, onClose]);

  return (
    <>
      <Overlay $isOpened={isOpened} onClick={onClose} />

      <SidebarContainer $isOpened={isOpened} {...props}>
        <SidebarContent ref={refSidebar} className={className}>
          {/* Header */}
          <Header>
            <Logo alt="Natours Logo" src={NatoursLogo} />
            <CloseButton
              onClick={onClose}
              type="button"
              aria-label="Close sidebar"
            >
              <XMarkIcon />
            </CloseButton>
          </Header>

          {/* Navigation */}
          <Nav>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <NavItem
                  key={item.id}
                  to={item.href}
                  $isActive={isActive}
                  onClick={() => {
                    // Auto-close sidebar after navigation on mobile
                    setTimeout(() => onClose(), 300);
                  }}
                >
                  <NavItemContent>
                    <NavIcon $isActive={isActive}>
                      <Icon className="icon" />
                    </NavIcon>
                    <NavLabel $isActive={isActive}>{item.label}</NavLabel>
                  </NavItemContent>

                  {item.badge && (
                    <Badge $isActive={isActive}>{item.badge}</Badge>
                  )}
                </NavItem>
              );
            })}
          </Nav>

          {/* Footer (Optional) */}
          <Footer>
            <FooterText>© 2026 Natours. All rights reserved.</FooterText>
          </Footer>
        </SidebarContent>
      </SidebarContainer>
    </>
  );
};

export default MobileSidebar;
