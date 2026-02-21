import { FC } from "react";

import { XMarkIcon } from "@heroicons/react/20/solid";
import toast, { ToastBar, Toaster } from "react-hot-toast";
import styled from "styled-components";

const StyledToastCloseButton = styled.div`
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;

  background-color: transparent;
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: var(--color-grey-100);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-grey-500);
  }

  /* Mobile: Larger touch target */
  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    padding: 0.6rem;

    svg {
      width: 2.4rem;
      height: 2.4rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: background-color 0.2s ease;

    &:hover {
      transform: none;
    }

    &:active {
      transform: none;
    }
  }
`;

export const Toast: FC = () => {
  return (
    <Toaster
      position="top-center"
      gutter={12}
      containerStyle={{ margin: "8px" }}
      toastOptions={{
        success: {
          duration: 3000,
        },
        error: {
          duration: 5000,
        },
        style: {
          fontSize: "16px",
          maxWidth: "500px",
          padding: "16px 24px",
          backgroundColor: "var(--color-grey-0)",
          color: "var(--color-grey-700)",
          borderRadius: "var(--border-radius-md)",
          boxShadow: "var(--shadow-lg)",
        },
      }}
      containerClassName="toast-container"
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== "loading" && (
                <StyledToastCloseButton
                  onClick={() => toast.dismiss(t.id)}
                  aria-label="Close notification"
                >
                  <XMarkIcon />
                </StyledToastCloseButton>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

// ─── Mobile-Specific Toast Styles ─────────────────────────────────────────────

// Add to your global styles:
/*
.toast-container {
  @media (max-width: 768px) {
    /* Position at bottom on mobile for better reachability */
/*    bottom: 2rem !important;
    top: auto !important;
  }
}

.toast-container > div {
  @media (max-width: 768px) {
    font-size: 1.5rem !important;
    max-width: calc(100vw - 3.2rem) !important;
    padding: 1.4rem 2rem !important;
    margin: 0 1.6rem !important;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem !important;
    padding: 1.2rem 1.6rem !important;
  }
}
*/
