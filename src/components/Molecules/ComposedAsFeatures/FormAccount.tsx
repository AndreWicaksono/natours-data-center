import { FC } from "react";
import styled, { keyframes } from "styled-components";

import {
  UserIcon,
  EnvelopeIcon,
  CheckBadgeIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";

import Form from "src/components/Molecules/Form/Form";
import ProfilePicture from "src/components/Molecules/ProfilePicture";

import { useAuthContext } from "src/hooks/useAuthContext";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ─── Container ────────────────────────────────────────────────────────────────

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.2rem;

  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 768px) {
    gap: 2.4rem;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ─── Profile Header ───────────────────────────────────────────────────────────

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  padding: 3.2rem;
  background: linear-gradient(
    135deg,
    var(--color-brand-50) 0%,
    var(--color-grey-50) 100%
  );

  border-radius: 1.6rem;
  border: 1px solid var(--color-grey-200);

  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  @media (max-width: 768px) {
    padding: 2.4rem;
    gap: 1.6rem;
  }

  @media (max-width: 480px) {
    padding: 2rem;
  }
`;

const ProfilePictureContainer = styled.div`
  position: relative;
`;

const ProfileName = styled.h2`
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--color-grey-900);
  margin: 0;
  text-align: center;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const ProfileEmail = styled.p`
  font-size: 1.5rem;
  color: var(--color-grey-600);
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

// ─── Info Cards Grid ──────────────────────────────────────────────────────────

const InfoCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(28rem, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.6rem;
  }

  @media (max-width: 480px) {
    gap: 1.2rem;
  }
`;

// ─── Info Card ────────────────────────────────────────────────────────────────

const InfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;

  padding: 2rem 2.4rem;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: 1.2rem;

  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-brand-300);
  }

  @media (max-width: 768px) {
    padding: 1.8rem 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.6rem 1.8rem;
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

const IconWrapper = styled.div<{ $variant?: "default" | "success" | "info" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: 4.8rem;
  height: 4.8rem;

  border-radius: 1.2rem;

  ${(props) => {
    switch (props.$variant) {
      case "success":
        return `
          background: linear-gradient(135deg, 
            var(--color-success-light) 0%, 
            var(--color-brand-100) 100%
          );
          color: var(--color-success-dark);
        `;
      case "info":
        return `
          background: linear-gradient(135deg, 
            var(--color-grey-100) 0%, 
            var(--color-grey-200) 100%
          );
          color: var(--color-grey-700);
        `;
      default:
        return `
          background: linear-gradient(135deg, 
            var(--color-brand-100) 0%, 
            var(--color-brand-200) 100%
          );
          color: var(--color-brand-700);
        `;
    }
  }}

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;

  svg {
    width: 2.4rem;
    height: 2.4rem;
  }

  ${InfoCard}:hover & {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 4.4rem;
    height: 4.4rem;

    svg {
      width: 2.2rem;
      height: 2.2rem;
    }
  }

  @media (max-width: 480px) {
    width: 4rem;
    height: 4rem;

    svg {
      width: 2rem;
      height: 2rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ${InfoCard}:hover & {
      transform: none;
    }
  }
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  min-width: 0;
`;

const InfoLabel = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const InfoValue = styled.span`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-900);

  /* Handle long text */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = styled.span<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;

  padding: 0.6rem 1.4rem;
  border-radius: 2rem;

  font-size: 1.4rem;
  font-weight: 600;

  ${(props) =>
    props.$isActive
      ? `
    background: var(--color-success-light);
    color: var(--color-success-dark);
    border: 2px solid var(--color-brand-300);
  `
      : `
    background: var(--color-danger-light);
    color: var(--color-danger-dark);
    border: 2px solid var(--color-danger-base);
  `}

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

  &::before {
    content: "";
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background: ${(props) =>
      props.$isActive
        ? "var(--color-success-base)"
        : "var(--color-danger-base)"};
    box-shadow: 0 0 0 2px
      ${(props) =>
        props.$isActive
          ? "var(--color-success-light)"
          : "var(--color-danger-light)"};
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
    padding: 0.5rem 1.2rem;
  }
`;

// ─── Main Component ───────────────────────────────────────────────────────────

const FormAccount: FC = () => {
  const { authContext } = useAuthContext();

  const fullName =
    `${authContext.firstName || ""} ${authContext.lastName || ""}`.trim();
  const initials = fullName || authContext.email;

  return (
    <Form>
      <AccountContainer>
        {/* Profile Header */}
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
              textName={initials || undefined}
            />
          </ProfilePictureContainer>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.8rem",
              alignItems: "center",
            }}
          >
            <ProfileName>{fullName || "User Account"}</ProfileName>
            <ProfileEmail>{authContext.email}</ProfileEmail>
          </div>
        </ProfileHeader>

        {/* Info Cards Grid */}
        <InfoCardsGrid>
          {/* Full Name Card */}
          <InfoCard>
            <IconWrapper>
              <UserIcon />
            </IconWrapper>
            <InfoContent>
              <InfoLabel>Full Name</InfoLabel>
              <InfoValue>{fullName || "—"}</InfoValue>
            </InfoContent>
          </InfoCard>

          {/* Email Card */}
          <InfoCard>
            <IconWrapper>
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

          {/* Created At Card */}
          <InfoCard>
            <IconWrapper $variant="info">
              <CalendarIcon />
            </IconWrapper>
            <InfoContent>
              <InfoLabel>Member Since</InfoLabel>
              <InfoValue>
                {authContext.createdAt
                  ? dayjs(authContext.createdAt).format("MMM DD, YYYY")
                  : "—"}
              </InfoValue>
            </InfoContent>
          </InfoCard>
        </InfoCardsGrid>
      </AccountContainer>
    </Form>
  );
};

export default FormAccount;
