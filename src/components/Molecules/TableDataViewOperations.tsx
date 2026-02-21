import { FC, ReactNode } from "react";
import styled, { keyframes } from "styled-components";

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

// ─── Sticky Wrapper ───────────────────────────────────────────────────────────

const StickyWrapper = styled.div`
  /* Sticky positioning */
  position: sticky;
  top: 0;
  z-index: 15;

  /* Spacing */
  padding: 1.6rem 0;

  /* Glassmorphism background */
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(249, 250, 251, 0.95) 100%
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Shadow on scroll */
  &::after {
    content: "";
    position: absolute;
    bottom: -1.2rem;
    left: 0;
    right: 0;
    height: 1.2rem;

    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.04) 0%,
      rgba(0, 0, 0, 0) 100%
    );

    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  /* Add class .is-scrolled with JS to show shadow */
  &.is-scrolled {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    &::after {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 1.2rem 0;
    margin: -1.2rem 0 2rem 0;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow 0.2s ease;
  }
`;

// ─── Main Container ───────────────────────────────────────────────────────────

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  flex-wrap: wrap;

  animation: ${slideDown} 0.4s ease-out;

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  /* Tablet */
  @media (max-width: 1024px) {
    gap: 1.4rem;
  }

  /* Mobile: Stack vertically */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1.2rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;

// ─── Filter Group ─────────────────────────────────────────────────────────────

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;

  /* Subtle grouping */
  padding: 0.8rem 1.6rem;
  background: linear-gradient(
    135deg,
    rgba(249, 250, 251, 0.5) 0%,
    rgba(255, 255, 255, 0.3) 100%
  );
  border-radius: 1.2rem;
  border: 1px solid transparent;

  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-grey-200);
    background: linear-gradient(
      135deg,
      rgba(249, 250, 251, 0.8) 0%,
      rgba(255, 255, 255, 0.6) 100%
    );
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
  }
`;

// ─── Filter Label ─────────────────────────────────────────────────────────────

export const FilterLabel = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-600);
  white-space: nowrap;

  display: flex;
  align-items: center;
  gap: 0.6rem;

  svg {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-grey-500);
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

// ─── Divider ──────────────────────────────────────────────────────────────────

export const Divider = styled.div`
  width: 1px;
  height: 3.2rem;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--color-grey-300) 50%,
    transparent 100%
  );

  @media (max-width: 768px) {
    display: none;
  }
`;

// ─── Main Component ───────────────────────────────────────────────────────────

const TableDataViewOperations: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <StickyWrapper>
      <Container>{children}</Container>
    </StickyWrapper>
  );
};

export default TableDataViewOperations;
