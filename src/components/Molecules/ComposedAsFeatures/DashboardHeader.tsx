import styled, { css, keyframes } from "styled-components";

import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "@tanstack/react-router";
import { FC, useState } from "react";

import Menus from "src/components/Molecules/Menus";
import ProfilePicture from "src/components/Molecules/ProfilePicture";

import { requestLogout } from "src/API/REST/POST/Auth";
import { cookieKey } from "src/Global/Constants";
import { useAuthContext } from "src/hooks/useAuthContext";
import useClientCookie from "src/hooks/useClientCookie";

// ─── Animations ───────────────────────────────────────────────────────────────

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
`;

// ─── Header Container ─────────────────────────────────────────────────────────

const StyledHeader = styled.header<{ $isSidebarExpanded: boolean }>`
  position: sticky;
  top: 0;
  z-index: 40;

  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: space-between;

  /* Enhanced glassmorphism effect */
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px) saturate(180%);
  
  border-bottom: 1px solid var(--color-grey-200);
  
  /* Enhanced shadow */
  box-shadow: 
    0 2px 12px rgba(0, 0, 0, 0.04),
    0 1px 4px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  
  padding: 1.2rem 1.6rem;
  
  animation: ${slideDown} 0.4s ease-out;
  transition: all 0.2s ease;

  /* Desktop */
  @media (min-width: 1024px) {
    ${(props) =>
      props.$isSidebarExpanded
        ? css`
            padding: 1.4rem 2.4rem;
          `
        : css`
            padding: 1.4rem 4rem;
            padding-left: 10.7rem;
          `}
   }
  }

  /* Tablet */
  @media (max-width: 1023px) and (min-width: 768px) {
    padding: 1.2rem 1.6rem;
    gap: 2rem;
  }

  /* Mobile */
  @media (max-width: 767px) {
    padding: 1.2rem 1.6rem;
    gap: 1.2rem;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ─── Left Section ─────────────────────────────────────────────────────────────

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 767px) {
    gap: 1.2rem;
  }
`;

// ─── Mobile Navigation Toggle ─────────────────────────────────────────────────

const MobileNavToggle = styled.button`
  display: none;
  align-items: center;
  justify-content: center;

  width: 4.4rem;
  height: 4.4rem;

  background: transparent;
  border: 1px solid var(--color-grey-300);
  border-radius: 1.2rem;

  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: var(--color-brand-50);
    border-color: var(--color-brand-400);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0) scale(0.95);
  }

  svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
    transition: color 0.2s ease;
  }

  &:hover svg {
    color: var(--color-brand-600);
  }

  @media (max-width: 1023px) {
    display: flex;
  }

  @media (max-width: 767px) {
    width: 4rem;
    height: 4rem;

    svg {
      width: 2.2rem;
      height: 2.2rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover,
    &:active {
      transform: none;
    }
  }
`;

// ─── Search Bar ───────────────────────────────────────────────────────────────

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 48rem;

  @media (max-width: 1023px) {
    // display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;

  padding: 1rem 1.4rem 1rem 4.2rem;

  font-size: 1.4rem;
  color: var(--color-grey-800);

  background: var(--color-grey-50);
  border: 1px solid var(--color-grey-300);
  border-radius: 1.2rem;

  transition: all 0.2s ease;

  &::placeholder {
    color: var(--color-grey-500);
  }

  &:hover {
    background: var(--color-grey-100);
    border-color: var(--color-grey-400);
  }

  &:focus {
    background: white;
    border-color: var(--color-brand-400);
    box-shadow: 0 0 0 3px rgba(85, 197, 122, 0.1);
    outline: none;
  }
`;

const SearchIcon = styled(MagnifyingGlassIcon)`
  position: absolute;
  left: 1.4rem;
  top: 50%;
  transform: translateY(-50%);

  width: 1.8rem;
  height: 1.8rem;

  color: var(--color-grey-500);
  pointer-events: none;
`;

// ─── Right Section ────────────────────────────────────────────────────────────

const HeaderRight = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  margin-left: auto;

  @media (max-width: 767px) {
    gap: 0.8rem;
  }
`;

// ─── Icon Button ──────────────────────────────────────────────────────────────

const IconButton = styled.button<{ $hasNotification?: boolean }>`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 4rem;
  height: 4rem;

  background: transparent;
  border: 1px solid var(--color-grey-300);
  border-radius: 1.2rem;

  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-grey-600);
    transition: color 0.2s ease;
  }

  &:hover {
    background: var(--color-grey-100);
    border-color: var(--color-grey-400);
    transform: translateY(-1px);

    svg {
      color: var(--color-grey-800);
    }
  }

  &:active {
    transform: translateY(0) scale(0.95);
  }

  /* Notification badge */
  ${(props) =>
    props.$hasNotification &&
    css`
      &::after {
        content: "";
        position: absolute;
        top: 0.6rem;
        right: 0.6rem;

        width: 1rem;
        height: 1rem;

        background: var(--color-danger-base);
        border: 2px solid white;
        border-radius: 50%;

        animation: ${pulse} 2s ease-in-out infinite;
      }
    `}

  @media (max-width: 767px) {
    width: 3.6rem;
    height: 3.6rem;

    svg {
      width: 1.8rem;
      height: 1.8rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover,
    &:active {
      transform: none;
    }

    &::after {
      animation: none;
    }
  }
`;

// ─── Notification Badge ───────────────────────────────────────────────────────

const NotificationBadge = styled.span`
  position: absolute;
  top: -0.4rem;
  right: -0.4rem;

  min-width: 2rem;
  height: 2rem;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0 0.6rem;

  font-size: 1.1rem;
  font-weight: 700;
  color: white;

  background: linear-gradient(
    135deg,
    var(--color-danger-base) 0%,
    var(--color-danger-dark) 100%
  );

  border: 2px solid white;
  border-radius: 10rem;

  box-shadow: 0 2px 8px rgba(187, 33, 36, 0.3);

  animation: ${bounce} 2s ease-in-out infinite;

  @media (max-width: 767px) {
    font-size: 1rem;
    min-width: 1.8rem;
    height: 1.8rem;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ─── User Info (Desktop only) ─────────────────────────────────────────────────

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;

  margin-right: 1.2rem;
  padding-right: 1.2rem;
  border-right: 1px solid var(--color-grey-200);

  @media (max-width: 1023px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-900);
  line-height: 1.2;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 20rem;
`;

const UserRole = styled.span`
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-grey-500);
  text-transform: capitalize;
  line-height: 1.2;
`;

// ─── Profile Button ───────────────────────────────────────────────────────────

const ProfileButton = styled.div`
  position: relative;
  cursor: pointer;

  /* Add hover ring */
  &::after {
    content: "";
    position: absolute;
    inset: -0.4rem;
    border: 2px solid transparent;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  &:hover::after {
    border-color: var(--color-brand-400);
    box-shadow: 0 0 0 4px rgba(85, 197, 122, 0.1);
  }

  @media (max-width: 767px) {
    &::after {
      inset: -0.3rem;
    }
  }
`;

// ─── Divider in Menu ──────────────────────────────────────────────────────────

const MenuSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

// ─── Main Component ───────────────────────────────────────────────────────────

const DashboardHeader: FC<{
  isSidebarExpanded: boolean;
  onToggleMobileSidebar?: () => void;
  notificationCount?: number;
}> = ({ isSidebarExpanded, onToggleMobileSidebar, notificationCount = 0 }) => {
  const { deleteCookie, getCookie } = useClientCookie();
  const { authContext } = useAuthContext();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async (token: string): Promise<void> => {
    if (token) {
      const response = await requestLogout(token);

      if (response.toString().startsWith("2")) {
        deleteCookie({ cookieKey, path: "/" });
        navigate({ replace: true, to: "/login" });
      }
    }
  };

  const fullName =
    `${authContext.firstName || ""} ${authContext.lastName || ""}`.trim();

  return (
    <StyledHeader $isSidebarExpanded={isSidebarExpanded}>
      {/* Left Section */}
      <HeaderLeft>
        {/* Mobile Menu Toggle */}
        <MobileNavToggle
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          <Bars3Icon />
        </MobileNavToggle>

        {/* Search Bar (Desktop) */}
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="search"
            placeholder="Search tours by name or city"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate({
                  to: "/tours",
                  search: { search: searchQuery },
                });
              }
            }}
            aria-label="Search"
          />
        </SearchContainer>
      </HeaderLeft>

      {/* Right Section */}
      <HeaderRight>
        {/* Notifications */}
        <IconButton
          $hasNotification={notificationCount > 0}
          aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount})` : ""}`}
        >
          <BellIcon />
          {notificationCount > 0 && (
            <NotificationBadge>
              {notificationCount > 99 ? "99+" : notificationCount}
            </NotificationBadge>
          )}
        </IconButton>

        {/* Settings (Desktop) */}
        <IconButton
          aria-label="Settings"
          style={{ display: window.innerWidth < 768 ? "none" : "flex" }}
        >
          <Cog6ToothIcon />
        </IconButton>

        {/* User Info (Desktop) */}
        <UserInfo>
          <UserName>{fullName || authContext.email || "User"}</UserName>
          <UserRole>Administrator</UserRole>
        </UserInfo>

        {/* Profile Dropdown Menu */}
        <Menus>
          <Menus.Menu>
            <Menus.Toggle id="btn-user" $icon={{ $height: 4.4, $width: 4.4 }}>
              <ProfileButton>
                <ProfilePicture
                  imgSize={{ height: 44, width: 44 }}
                  imgSrc={
                    authContext.photo.location
                      ? `${
                          import.meta.env.VITE_URL_SERVER
                        }/storage/v1/object/public/${authContext.photo.location}`
                      : ""
                  }
                  showText={false}
                  showStatus={true}
                  status="online"
                />
              </ProfileButton>
            </Menus.Toggle>

            <Menus.List id="btn-user">
              <MenuSection>
                <Menus.Button
                  icon={<UserIcon height={18} width={18} />}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({ to: "/account" });
                  }}
                  disabled={false}
                >
                  Account Settings
                </Menus.Button>

                {/* <Menus.Button
                    icon={<Cog6ToothIcon height={18} width={18} />}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate({ to: "/settings" });
                    }}
                    disabled={false}
                  >
                    Preferences
                  </Menus.Button> */}
              </MenuSection>

              <Menus.Divider />

              <MenuSection>
                <Menus.Button
                  name="danger"
                  icon={<ArrowRightOnRectangleIcon height={18} width={18} />}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout(getCookie(cookieKey) ?? "");
                  }}
                  disabled={false}
                >
                  Sign Out
                </Menus.Button>
              </MenuSection>
            </Menus.List>
          </Menus.Menu>
        </Menus>
      </HeaderRight>
    </StyledHeader>
  );
};

export default DashboardHeader;
