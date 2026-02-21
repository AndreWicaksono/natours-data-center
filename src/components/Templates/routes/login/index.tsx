import { FC } from "react";
import styled, { keyframes } from "styled-components";

import {
  ShieldCheckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

import FormLogin from "src/components/Molecules/ComposedAsFeatures/FormLogin";
import Logo from "src/components/Molecules/Logo";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
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

// ─── Main Layout ──────────────────────────────────────────────────────────────

const LoginLayout = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  /* Gradient background */
  background: linear-gradient(
    135deg,
    var(--color-brand-50) 0%,
    var(--color-grey-50) 50%,
    var(--color-brand-100) 100%
  );

  animation: ${fadeIn} 0.8s ease-out;

  /* Decorative gradient overlay */
  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -20%;
    width: 80%;
    height: 120%;

    background: radial-gradient(
      circle,
      rgba(126, 213, 111, 0.15) 0%,
      transparent 70%
    );

    border-radius: 50%;
    pointer-events: none;

    animation: ${floatAnimation} 20s ease-in-out infinite;
  }

  /* Second decorative element */
  &::after {
    content: "";
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 60%;
    height: 80%;

    background: radial-gradient(
      circle,
      rgba(40, 180, 133, 0.1) 0%,
      transparent 70%
    );

    border-radius: 50%;
    pointer-events: none;

    animation: ${floatAnimation} 25s ease-in-out infinite reverse;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;

    &::before,
    &::after {
      animation: none;
    }
  }
`;

// ─── Content Container ────────────────────────────────────────────────────────

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;

  display: flex;
  width: 100%;
  max-width: 140rem;
  margin: 0 auto;

  /* Desktop: Two columns */
  @media (min-width: 1024px) {
    align-items: center;
    justify-content: space-between;
    gap: 8rem;
    padding: 4rem 6rem;
  }

  /* iPad/Tablet: Two columns, tighter spacing */
  @media (min-width: 768px) and (max-width: 1023px) {
    align-items: center;
    justify-content: space-between;
    gap: 4rem;
    padding: 4rem 4rem;
  }

  /* Mobile: Stacked */
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 2rem;
    padding: 2rem 2rem;
  }

  @media (max-width: 480px) {
    gap: 2.4rem;
    padding: 2.4rem 1.6rem;
  }
`;

// ─── Hero Section ─────────────────────────────────────────────────────────────

const HeroSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;

  max-width: 56rem;

  animation: ${scaleIn} 0.8s ease-out;

  @media (max-width: 1023px) {
    text-align: center;
    align-items: center;
  }

  @media (max-width: 767px) {
    max-width: 100%;
    gap: 1.6rem;
    flex: 0 0 auto;
  }

  @media (max-width: 480px) {
    gap: 2rem;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;

  @media (max-width: 1023px) {
    justify-content: center;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 767px) {
    gap: 1.6rem;
  }

  @media (max-width: 480px) {
    gap: 1.4rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 5.2rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-grey-900);
  margin: 0;

  background: linear-gradient(
    135deg,
    var(--color-neutral-900) 0%,
    var(--color-brand-700) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 1023px) {
    font-size: 4.4rem;
  }

  @media (max-width: 767px) {
    font-size: 3rem;
  }

  @media (max-width: 480px) {
    font-size: 3.2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 2rem;
  font-weight: 500;
  line-height: 1.6;
  color: var(--color-grey-700);
  margin: 0;

  @media (max-width: 1023px) {
    font-size: 1.8rem;
  }

  @media (max-width: 767px) {
    font-size: 1.7rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.6rem;
  line-height: 1.7;
  color: var(--color-grey-600);
  margin: 0;

  @media (max-width: 767px) {
    font-size: 1.5rem;
    display: none;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const FeatureList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;

  margin: 1.6rem 0 0 0;
  padding: 0;
  list-style: none;

  @media (max-width: 1023px) {
    align-items: flex-start;
  }

  @media (max-width: 767px) {
    gap: 1.4rem;
    margin-top: 1.2rem;
    display: none;
  }

  @media (max-width: 480px) {
    gap: 1.2rem;
  }
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1.2rem;

  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-grey-700);

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    width: 3.6rem;
    height: 3.6rem;

    background: linear-gradient(
      135deg,
      var(--color-primary-400) 0%,
      var(--color-brand-600) 100%
    );

    color: var(--color-neutral-white);
    border-radius: 1rem;

    box-shadow: 0 2px 8px rgba(85, 197, 122, 0.25);

    svg {
      width: 2rem;
      height: 2rem;
    }
  }

  @media (max-width: 767px) {
    font-size: 1.4rem;
    gap: 1rem;

    .icon {
      width: 3.2rem;
      height: 3.2rem;

      svg {
        width: 1.8rem;
        height: 1.8rem;
      }
    }
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;

    .icon {
      width: 3rem;
      height: 3rem;
      border-radius: 0.8rem;

      svg {
        width: 1.6rem;
        height: 1.6rem;
      }
    }
  }
`;

// ─── Form Section ─────────────────────────────────────────────────────────────

const FormSection = styled.div`
  flex: 0 0 auto;
  width: 100%;
  max-width: 48rem;

  animation: ${scaleIn} 0.8s ease-out 0.2s backwards;

  @media (min-width: 768px) and (max-width: 1023px) {
    max-width: 44rem;
  }

  @media (max-width: 767px) {
    max-width: 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);

  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 2.4rem;

  padding: 4rem;

  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  transition: all 0.3s ease;

  &:hover {
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.1),
      0 10px 28px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);

    transform: translateY(-2px);
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    padding: 3.6rem;
  }

  @media (max-width: 767px) {
    padding: 3.2rem 2.4rem;
    border-radius: 2rem;
  }

  @media (max-width: 480px) {
    padding: 2.8rem 2rem;
    border-radius: 1.6rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow 0.3s ease;

    &:hover {
      transform: none;
    }
  }
`;

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = styled.footer`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);

  text-align: center;
  color: var(--color-grey-500);
  font-size: 1.3rem;

  z-index: 1;

  @media (max-width: 767px) {
    position: relative;
    bottom: auto;
    left: auto;
    transform: none;
    margin-top: 3rem;
    padding: 0 2rem;
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    margin-top: 2rem;
    font-size: 1.1rem;
  }
`;

// ─── Main Component ───────────────────────────────────────────────────────────

const TemplatePageLogin: FC = () => {
  return (
    <LoginLayout>
      <ContentContainer>
        {/* Hero Section */}
        <HeroSection>
          <LogoContainer>
            <Logo />
          </LogoContainer>

          <HeroContent>
            <HeroTitle>Tour Management System</HeroTitle>

            <HeroSubtitle>
              Streamline your tour operations with powerful tools
            </HeroSubtitle>

            <HeroDescription>
              Access your centralized dashboard to manage tours, track bookings,
              analyze performance, and deliver exceptional experiences to your
              customers.
            </HeroDescription>

            <FeatureList>
              <FeatureItem>
                <span className="icon">
                  <ShieldCheckIcon />
                </span>
                <span>Secure tour & booking management</span>
              </FeatureItem>

              <FeatureItem>
                <span className="icon">
                  <ChartBarIcon />
                </span>
                <span>Real-time analytics & reporting</span>
              </FeatureItem>

              <FeatureItem>
                <span className="icon">
                  <Cog6ToothIcon />
                </span>
                <span>Centralized system control</span>
              </FeatureItem>

              <FeatureItem>
                <span className="icon">
                  <ClockIcon />
                </span>
                <span>24/7 system access</span>
              </FeatureItem>
            </FeatureList>
          </HeroContent>
        </HeroSection>

        {/* Form Section */}
        <FormSection>
          <FormCard>
            <FormLogin />
          </FormCard>
        </FormSection>
      </ContentContainer>

      {/* Footer */}
      <Footer>© 2026 Natours</Footer>
    </LoginLayout>
  );
};

export default TemplatePageLogin;
