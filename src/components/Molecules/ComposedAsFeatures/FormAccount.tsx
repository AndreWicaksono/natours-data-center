import { FC } from "react";
import styled, { keyframes } from "styled-components";

import {
  UserIcon,
  EnvelopeIcon,
  CheckBadgeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Form from "src/components/Molecules/Form/Form";
import ProfilePicture from "src/components/Molecules/ProfilePicture";

import { useAuthContext } from "src/hooks/useAuthContext";

// Enable relative time plugin
dayjs.extend(relativeTime);

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
`;

// ─── Container ────────────────────────────────────────────────────────────────

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.2rem;

  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    gap: 2.4rem;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ─── Profile Header (Enhanced) ────────────────────────────────────────────────

const ProfileHeader = styled.div`
  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.4rem;

  padding: 4rem 3.2rem 3.2rem;

  /* Enhanced gradient background */
  background: linear-gradient(
    135deg,
    rgba(126, 213, 111, 0.08) 0%,
    rgba(255, 255, 255, 0.95) 50%,
    rgba(249, 250, 251, 0.9) 100%
  );

  backdrop-filter: blur(20px);

  border-radius: 2rem;
  border: 1px solid var(--color-grey-200);

  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.06),
    0 4px 12px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);

  /* Decorative background pattern */
  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -20%;
    width: 60%;
    height: 120%;

    background: radial-gradient(
      circle,
      rgba(126, 213, 111, 0.12) 0%,
      transparent 70%
    );

    border-radius: 50%;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 50%;
    height: 80%;

    background: radial-gradient(
      circle,
      rgba(40, 180, 133, 0.08) 0%,
      transparent 70%
    );

    border-radius: 50%;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 3.2rem 2.4rem 2.4rem;
    gap: 2rem;
  }

  @media (max-width: 480px) {
    padding: 2.8rem 2rem 2rem;
    gap: 1.6rem;
  }
`;

const ProfilePictureContainer = styled.div`
  position: relative;
  z-index: 1;

  animation: ${scaleIn} 0.6s ease-out 0.2s backwards;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const ProfileInfoWrapper = styled.div`
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: center;

  animation: ${slideIn} 0.6s ease-out 0.3s backwards;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const ProfileName = styled.h2`
  font-size: 3.2rem;
  font-weight: 700;
  color: var(--color-grey-900);
  margin: 0;
  text-align: center;
  line-height: 1.2;

  /* Subtle gradient on text */
  background: linear-gradient(
    135deg,
    var(--color-grey-900) 0%,
    var(--color-brand-700) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.8rem;
  }

  @media (max-width: 480px) {
    font-size: 2.4rem;
  }
`;

const ProfileEmail = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--color-grey-600);
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const ProfileRole = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;

  padding: 0.8rem 1.8rem;

  background: linear-gradient(
    135deg,
    var(--color-brand-100) 0%,
    var(--color-brand-50) 100%
  );

  border: 1.5px solid var(--color-brand-300);
  border-radius: 2.4rem;

  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-brand-700);

  box-shadow: 0 2px 8px rgba(85, 197, 122, 0.15);

  svg {
    width: 1.8rem;
    height: 1.8rem;
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
    padding: 0.7rem 1.6rem;

    svg {
      width: 1.6rem;
      height: 1.6rem;
    }
  }
`;

// ─── Section Title ────────────────────────────────────────────────────────────

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-grey-800);
  margin: 1.6rem 0 0 0;

  display: flex;
  align-items: center;
  gap: 1rem;

  &::after {
    content: "";
    flex: 1;
    height: 2px;
    background: linear-gradient(
      90deg,
      var(--color-grey-300) 0%,
      transparent 100%
    );
  }

  @media (max-width: 768px) {
    font-size: 1.7rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

// ─── Info Cards Grid ──────────────────────────────────────────────────────────

const InfoCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
  gap: 2rem;

  animation: ${fadeIn} 0.6s ease-out 0.4s backwards;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.6rem;
  }

  @media (max-width: 480px) {
    gap: 1.2rem;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ─── Info Card (Enhanced) ─────────────────────────────────────────────────────

const InfoCard = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  gap: 1.8rem;

  padding: 2.4rem 2.8rem;

  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);

  border: 1px solid var(--color-grey-200);
  border-radius: 1.6rem;

  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.04),
    0 2px 4px rgba(0, 0, 0, 0.02);

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Subtle shine effect on hover */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;

    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(126, 213, 111, 0.03) 50%,
      transparent 100%
    );

    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 12px 32px rgba(0, 0, 0, 0.08),
      0 4px 12px rgba(0, 0, 0, 0.04);
    border-color: var(--color-brand-300);

    &::before {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 2rem 2.4rem;
    gap: 1.6rem;
  }

  @media (max-width: 480px) {
    padding: 1.8rem 2rem;
    gap: 1.4rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      box-shadow 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      transform: none;
    }
  }
`;

// ─── Icon Wrapper (Enhanced) ──────────────────────────────────────────────────

const IconWrapper = styled.div<{
  $variant?: "default" | "success" | "info" | "primary";
}>`
  position: relative;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: 5.6rem;
  height: 5.6rem;

  border-radius: 1.4rem;

  ${(props) => {
    switch (props.$variant) {
      case "success":
        return `
          background: linear-gradient(135deg, 
            var(--color-success-light) 0%, 
            var(--color-brand-100) 100%
          );
          color: var(--color-success-dark);
          box-shadow: 0 4px 12px rgba(34, 187, 51, 0.15);
        `;
      case "info":
        return `
          background: linear-gradient(135deg, 
            var(--color-grey-100) 0%, 
            var(--color-grey-200) 100%
          );
          color: var(--color-grey-700);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        `;
      case "primary":
        return `
          background: linear-gradient(135deg, 
            var(--color-blue-100) 0%, 
            rgba(224, 242, 254, 0.5) 100%
          );
          color: var(--color-blue-700);
          box-shadow: 0 4px 12px rgba(3, 105, 161, 0.12);
        `;
      default:
        return `
          background: linear-gradient(135deg, 
            var(--color-brand-100) 0%, 
            var(--color-brand-200) 100%
          );
          color: var(--color-brand-700);
          box-shadow: 0 4px 12px rgba(85, 197, 122, 0.2);
        `;
    }
  }}

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  svg {
    width: 2.8rem;
    height: 2.8rem;

    transition: transform 0.3s ease;
  }

  ${InfoCard}:hover & {
    transform: scale(1.1) rotate(-3deg);

    svg {
      transform: scale(1.05);
    }
  }

  @media (max-width: 768px) {
    width: 5.2rem;
    height: 5.2rem;

    svg {
      width: 2.6rem;
      height: 2.6rem;
    }
  }

  @media (max-width: 480px) {
    width: 4.8rem;
    height: 4.8rem;

    svg {
      width: 2.4rem;
      height: 2.4rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ${InfoCard}:hover & {
      transform: none;

      svg {
        transform: none;
      }
    }
  }
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
  min-width: 0;
`;

const InfoLabel = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-500);
  text-transform: uppercase;
  letter-spacing: 0.06em;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const InfoValue = styled.span`
  font-size: 1.7rem;
  font-weight: 600;
  color: var(--color-grey-900);
  line-height: 1.3;

  /* Handle long text */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

// ─── Status Badge (Enhanced) ──────────────────────────────────────────────────

const StatusBadge = styled.span<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;

  padding: 0.8rem 1.6rem;
  border-radius: 2.4rem;

  font-size: 1.4rem;
  font-weight: 700;

  ${(props) =>
    props.$isActive
      ? `
    background: linear-gradient(135deg,
      var(--color-success-light) 0%,
      var(--color-brand-100) 100%
    );
    color: var(--color-success-dark);
    border: 2px solid var(--color-brand-400);
    box-shadow: 0 4px 12px rgba(34, 187, 51, 0.2);
  `
      : `
    background: linear-gradient(135deg,
      var(--color-danger-light) 0%,
      rgba(254, 242, 242, 0.8) 100%
    );
    color: var(--color-danger-dark);
    border: 2px solid var(--color-danger-base);
    box-shadow: 0 4px 12px rgba(187, 33, 36, 0.15);
  `}

  transition: all 0.2s ease;

  &::before {
    content: "";
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: ${(props) =>
      props.$isActive
        ? "var(--color-success-base)"
        : "var(--color-danger-base)"};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$isActive
          ? "var(--color-success-light)"
          : "var(--color-danger-light)"};

    animation: ${(props) => (props.$isActive ? pulse : "none")} 2s ease-in-out
      infinite;
  }

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
    padding: 0.7rem 1.4rem;

    &::before {
      width: 0.9rem;
      height: 0.9rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }

    &:hover {
      transform: none;
    }
  }
`;

// ─── Time Badge ───────────────────────────────────────────────────────────────

const TimeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;

  padding: 0.4rem 1rem;

  background: var(--color-grey-100);
  border: 1px solid var(--color-grey-300);
  border-radius: 1.6rem;

  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-grey-600);

  svg {
    width: 1.4rem;
    height: 1.4rem;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 0.3rem 0.9rem;
  }
`;

// ─── Main Component ───────────────────────────────────────────────────────────

const FormAccount: FC = () => {
  const { authContext } = useAuthContext();

  const fullName =
    `${authContext.firstName || ""} ${authContext.lastName || ""}`.trim();
  const displayName = fullName || authContext.email || "User Account";

  const memberSince = authContext.createdAt
    ? dayjs(authContext.createdAt)
    : null;

  const memberSinceFormatted = memberSince
    ? memberSince.format("MMM DD, YYYY")
    : "—";

  const memberSinceRelative = memberSince ? memberSince.fromNow() : "";

  return (
    <Form>
      <AccountContainer>
        {/* Enhanced Profile Header */}
        <ProfileHeader>
          <ProfilePictureContainer>
            <ProfilePicture
              flex={{ justifyContent: "center" }}
              imgSize={{ height: 128, width: 128 }}
              imgSrc={
                authContext.photo.location
                  ? `${import.meta.env.VITE_URL_SERVER}/storage/v1/object/public/${
                      authContext.photo.location
                    }`
                  : undefined
              }
              showStatus={true}
              status="online"
            />
          </ProfilePictureContainer>

          <ProfileInfoWrapper>
            <ProfileName>{displayName}</ProfileName>
            <ProfileEmail>{authContext.email}</ProfileEmail>
            <ProfileRole>
              <ShieldCheckIcon />
              Administrator
            </ProfileRole>
          </ProfileInfoWrapper>
        </ProfileHeader>

        {/* Account Details Section */}
        <div>
          <SectionTitle>Account Details</SectionTitle>

          <InfoCardsGrid>
            {/* Full Name Card */}
            <InfoCard>
              <IconWrapper>
                <UserIcon />
              </IconWrapper>
              <InfoContent>
                <InfoLabel>Full Name</InfoLabel>
                <InfoValue>{fullName || "Not provided"}</InfoValue>
              </InfoContent>
            </InfoCard>

            {/* Email Card */}
            <InfoCard>
              <IconWrapper $variant="primary">
                <EnvelopeIcon />
              </IconWrapper>
              <InfoContent>
                <InfoLabel>Email Address</InfoLabel>
                <InfoValue>{authContext.email || "—"}</InfoValue>
              </InfoContent>
            </InfoCard>

            {/* Status Card */}
            <InfoCard>
              <IconWrapper $variant="success">
                <CheckBadgeIcon />
              </IconWrapper>
              <InfoContent>
                <InfoLabel>Account Status</InfoLabel>
                <InfoValue>
                  <StatusBadge $isActive={authContext.isActive ?? false}>
                    {authContext.isActive ? "Active" : "Inactive"}
                  </StatusBadge>
                </InfoValue>
              </InfoContent>
            </InfoCard>

            {/* Member Since Card */}
            <InfoCard>
              <IconWrapper $variant="info">
                <CalendarIcon />
              </IconWrapper>
              <InfoContent>
                <InfoLabel>Member Since</InfoLabel>
                <InfoValue>
                  {memberSinceFormatted}
                  {memberSinceRelative && (
                    <>
                      <br />
                      <TimeBadge>
                        <ClockIcon />
                        {memberSinceRelative}
                      </TimeBadge>
                    </>
                  )}
                </InfoValue>
              </InfoContent>
            </InfoCard>
          </InfoCardsGrid>
        </div>
      </AccountContainer>
    </Form>
  );
};

export default FormAccount;
