import { CSSProperties, FC, FormHTMLAttributes } from "react";
import styled, { css } from "styled-components";

// ─── Form Container ───────────────────────────────────────────────────────────

const StyledForm = styled.form<{
  $type?: "regular" | "modal";
  $boxShadow?: boolean;
}>`
  /* Default form styling */
  padding: 2.4rem 4rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  /* Width based on type */
  ${(props) =>
    props.$type === "modal"
      ? css`
          /* Modal: Use full available width */
          width: 100%;
          max-width: 100%;
          border: none;
          border-radius: 0;
          padding: 0;
          background-color: transparent;
        `
      : css`
          /* Regular: Constrained width */
          width: 100%;
          max-width: 80rem;
        `}

  /* Optional shadow */
  ${(props) =>
    props.$boxShadow &&
    props.$type !== "modal" &&
    css`
      box-shadow: var(--shadow-md);
    `}

  /* Tablet */
  @media (max-width: 1024px) {
    ${(props) =>
      props.$type === "regular" &&
      css`
        max-width: 70rem;
        padding: 2rem 3.2rem;
      `}
  }

  /* Mobile */
  @media (max-width: 768px) {
    ${(props) =>
      props.$type === "regular" &&
      css`
        width: 100%;
        max-width: 100%;
        padding: 1.6rem 2rem;
        border-radius: var(--border-radius-sm);
      `}
  }

  /* Small mobile */
  @media (max-width: 480px) {
    ${(props) =>
      props.$type === "regular" &&
      css`
        padding: 1.4rem 1.6rem;
      `}
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// ─── Form Component ───────────────────────────────────────────────────────────

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  type?: "regular" | "modal";
  boxShadow?: boolean;
  cssOption?: CSSProperties;
}

const Form: FC<FormProps> = ({
  children,
  type = "regular",
  boxShadow = false,
  cssOption,
  ...props
}) => {
  return (
    <StyledForm
      $type={type}
      $boxShadow={boxShadow}
      style={cssOption}
      {...props}
    >
      {children}
    </StyledForm>
  );
};

export default Form;
