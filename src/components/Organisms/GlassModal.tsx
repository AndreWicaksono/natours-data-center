import { FC, ReactNode, useEffect, MutableRefObject } from "react";
import { createPortal } from "react-dom";

import { XMarkIcon } from "@heroicons/react/24/solid";

import styled, { keyframes } from "styled-components";

import { useOutsideClick } from "src/hooks/useOutsideClick";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `;

const scaleIn = keyframes`
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  `;

const slideUp = keyframes`
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

// ─── Glassmorphism Overlay ────────────────────────────────────────────────────

const GlassOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  z-index: 1000;

  /* Glassmorphism effect */
  background: rgba(17, 24, 39, 0.5); /* grey-900 with 50% opacity */
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);

  animation: ${fadeIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Mobile: Darker overlay */
  @media (max-width: 768px) {
    background: rgba(17, 24, 39, 0.7);
    backdrop-filter: blur(8px) saturate(180%);
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ─── Glass Modal Container ────────────────────────────────────────────────────

const GlassModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;

  width: 90%;
  max-width: 80rem;
  max-height: 90dvh;

  /* Glassmorphism effect */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 2rem;

  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.15),
    0 10px 10px -5px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.6);

  overflow: hidden;
  animation: ${scaleIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Tablet */
  @media (max-width: 1024px) {
    max-width: 70rem;
    max-height: 92dvh;
  }

  /* Mobile: Bottom sheet with glass effect */
  @media (max-width: 768px) {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    transform: none;

    width: 100%;
    max-width: 100%;
    max-height: 95dvh;

    border-radius: 2rem 2rem 0 0;
    border-bottom: none;

    /* Slightly more opaque on mobile for readability */
    background: rgba(255, 255, 255, 0.98);

    animation: ${slideUp} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @media (max-width: 480px) {
    max-height: 98dvh;
    border-radius: 1.6rem 1.6rem 0 0;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ─── Modal Header ─────────────────────────────────────────────────────────────

const ModalHeader = styled.div`
  position: relative;
  padding: 2.4rem 3.2rem;

  /* Frosted glass effect for header */
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);

  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 2rem 2.4rem;

    /* Mobile: Add drag handle indicator */
    &::before {
      content: "";
      position: absolute;
      top: 0.8rem;
      left: 50%;
      transform: translateX(-50%);

      width: 4rem;
      height: 0.4rem;

      background: rgba(0, 0, 0, 0.2);
      border-radius: 2rem;
    }
  }

  @media (max-width: 480px) {
    padding: 1.8rem 2rem;
  }
`;

const ModalTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--color-grey-900);
  margin: 0;
  padding-right: 4rem; /* Space for close button */

  @media (max-width: 768px) {
    font-size: 2rem;
    padding-top: 1.2rem; /* Space for drag handle */
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const ModalSubtitle = styled.p`
  font-size: 1.5rem;
  color: var(--color-grey-600);
  margin: 0.4rem 0 0 0;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

// ─── Close Button ─────────────────────────────────────────────────────────────

const CloseButton = styled.button`
  position: absolute;
  top: 2.4rem;
  right: 2.4rem;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 3.6rem;
  height: 3.6rem;

  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;

  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95) rotate(90deg);
  }

  svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-grey-700);
  }

  /* Mobile: Larger touch target */
  @media (max-width: 768px) {
    top: 2rem;
    right: 2rem;
    width: 4rem;
    height: 4rem;

    svg {
      width: 2.4rem;
      height: 2.4rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      background 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }
`;

// ─── Modal Content ────────────────────────────────────────────────────────────

const ModalContent = styled.div<{ $maxHeight?: string }>`
  padding: 2.4rem 3.2rem;
  max-height: ${(p) => p.$maxHeight || "calc(90dvh - 12rem)"};
  overflow-y: auto;
  overflow-x: hidden;

  /* Smooth scrolling */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 0.8rem;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 1rem;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 1rem;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }

  @media (max-width: 768px) {
    padding: 2rem 2.4rem;
    max-height: calc(95dvh - 10rem);
  }

  @media (max-width: 480px) {
    padding: 1.8rem 2rem;
    max-height: calc(98dvh - 9rem);
  }
`;

// ─── Modal Footer ─────────────────────────────────────────────────────────────

const ModalFooter = styled.div`
  padding: 2rem 3.2rem;

  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);

  border-top: 1px solid rgba(0, 0, 0, 0.05);

  display: flex;
  gap: 1.2rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    padding: 1.6rem 2.4rem;
    flex-direction: column;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    padding: 1.4rem 2rem;
  }
`;

// ─── Component Props ──────────────────────────────────────────────────────────

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string | null;
  children: ReactNode;
  footer?: ReactNode;
  maxHeight?: string;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const GlassModalComponent: FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxHeight,
}) => {
  const modalRef = useOutsideClick(onClose) as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <GlassOverlay>
      <GlassModal ref={modalRef}>
        {(title || subtitle) && (
          <ModalHeader>
            {title && <ModalTitle>{title}</ModalTitle>}
            {subtitle && <ModalSubtitle>{subtitle}</ModalSubtitle>}
            <CloseButton onClick={onClose} aria-label="Close modal">
              <XMarkIcon />
            </CloseButton>
          </ModalHeader>
        )}

        <ModalContent $maxHeight={maxHeight}>{children}</ModalContent>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </GlassModal>
    </GlassOverlay>,
    document.body
  );
};

export default GlassModalComponent;
