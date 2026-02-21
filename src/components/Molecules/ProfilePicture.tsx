import { FC } from "react";
import styled, { css, keyframes } from "styled-components";

import { UserCircleIcon } from "@heroicons/react/24/solid";

// ─── Animations ───────────────────────────────────────────────────────────────

const pulseRing = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 1;
  }
  70% {
    transform: scale(1);
    opacity: 0;
  }
  100% {
    transform: scale(0.95);
    opacity: 0;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// ─── Container ────────────────────────────────────────────────────────────────

const StyledProfilePicture = styled.div<{
  $flex?: { justifyContent: "center" | "flex-end" | "flex-start" | string };
}>`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  justify-content: ${({ $flex }) =>
    $flex && $flex.justifyContent ? $flex.justifyContent : "flex-start"};

  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);

  animation: ${fadeIn} 0.3s ease-out;

  @media (max-width: 767px) {
    gap: 1rem;
    font-size: 1.3rem;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ─── Avatar Container with Status ─────────────────────────────────────────────

const AvatarContainer = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
`;

// ─── Avatar with gradient border ──────────────────────────────────────────────

const AvatarWrapper = styled.div<{ $size: { height: number; width: number } }>`
  position: relative;
  width: ${(props) => props.$size.width}px;
  height: ${(props) => props.$size.height}px;

  border-radius: 50%;

  /* Gradient border effect */
  background: linear-gradient(
    135deg,
    var(--color-brand-400) 0%,
    var(--color-brand-600) 100%
  );

  padding: 2px;

  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(85, 197, 122, 0.3);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`;

const Avatar = styled.img`
  display: block;
  width: 100%;
  height: 100%;

  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;

  border-radius: 50%;
  background: var(--color-grey-100);

  transition: all 0.2s ease;
`;

const DefaultAvatar = styled(UserCircleIcon)<{
  $size: { height: number; width: number };
}>`
  width: ${(props) => props.$size.width}px;
  height: ${(props) => props.$size.height}px;

  fill: var(--color-grey-300);
  background: var(--color-grey-50);
  border-radius: 50%;

  transition: all 0.2s ease;

  &:hover {
    fill: var(--color-grey-400);
  }
`;

// ─── Status Indicator ─────────────────────────────────────────────────────────

const StatusIndicator = styled.span<{
  $status: "online" | "offline" | "away" | "busy";
  $size: number;
}>`
  position: absolute;
  bottom: 0;
  right: 0;

  width: ${(props) => Math.max(props.$size * 0.3, 10)}px;
  height: ${(props) => Math.max(props.$size * 0.3, 10)}px;

  border-radius: 50%;
  border: 2px solid var(--color-grey-0);

  background-color: ${(props) => {
    switch (props.$status) {
      case "online":
        return "var(--color-brand-500)";
      case "away":
        return "var(--color-warning-base)";
      case "busy":
        return "var(--color-danger-base)";
      case "offline":
      default:
        return "var(--color-grey-400)";
    }
  }};

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  transition: all 0.2s ease;

  /* Pulse animation for online status */
  ${(props) =>
    props.$status === "online" &&
    css`
      &::before {
        content: "";
        position: absolute;
        inset: -2px;

        border-radius: 50%;
        border: 2px solid var(--color-brand-500);

        animation: ${pulseRing} 2s cubic-bezier(0.455, 0.03, 0.515, 0.955)
          infinite;
      }
    `}

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }
`;

// ─── Text Container ───────────────────────────────────────────────────────────

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  min-width: 0; /* Allow text truncation */
`;

const DisplayEmail = styled.span`
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--color-grey-500);
  line-height: 1.2;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 767px) {
    font-size: 1.1rem;
  }
`;

// ─── Main Component ───────────────────────────────────────────────────────────

const ProfilePicture: FC<{
  flex?: { justifyContent: "center" | "flex-end" | "flex-start" | string };
  imgSize?: { height: number; width: number };
  imgSrc?: string;
  textName?: string;
  textEmail?: string;
  showStatus?: boolean;
  status?: "online" | "offline" | "away" | "busy";
  showText?: boolean;
}> = ({
  flex,
  imgSize = { height: 40, width: 40 },
  imgSrc,
  textName,
  textEmail,
  showStatus = false,
  status = "offline",
  showText = true,
}) => {
  return (
    <StyledProfilePicture $flex={flex}>
      <AvatarContainer>
        {imgSrc ? (
          <AvatarWrapper $size={imgSize}>
            <Avatar
              alt={
                textName ? `Profile picture of ${textName}` : "Profile Picture"
              }
              src={imgSrc}
            />
          </AvatarWrapper>
        ) : (
          <DefaultAvatar
            $size={imgSize}
            aria-label={
              textName ? `Profile picture of ${textName}` : "Profile Picture"
            }
          />
        )}

        {showStatus && (
          <StatusIndicator
            $status={status}
            $size={imgSize.height}
            aria-label={`Status: ${status}`}
          />
        )}
      </AvatarContainer>

      {showText && (textName || textEmail) && (
        <TextContainer>
          {/* {textName && <DisplayName>{textName}</DisplayName>} */}
          {textEmail && <DisplayEmail>{textEmail}</DisplayEmail>}
        </TextContainer>
      )}
    </StyledProfilePicture>
  );
};

export default ProfilePicture;
