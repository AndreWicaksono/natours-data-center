import { FC } from "react";

import { XMarkIcon } from "@heroicons/react/20/solid";
import toast, { ToastBar, Toaster } from "react-hot-toast";
import styled from "styled-components";

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
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== "loading" && (
                <StyledToastCloseButton onClick={() => toast.dismiss(t.id)}>
                  <XMarkIcon height={24} width={24} />
                </StyledToastCloseButton>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

const StyledToastCloseButton = styled.div`
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;

  background-color: none;
  cursor: pointer;
`;
