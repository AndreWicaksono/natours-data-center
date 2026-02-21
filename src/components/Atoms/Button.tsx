import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";
import styled, { css, RuleSet } from "styled-components";

// ─── Size Definitions ─────────────────────────────────────────────────────────

const sizes: {
  small: RuleSet<object>;
  medium: RuleSet<object>;
  large: RuleSet<object>;
} = {
  small: css`
    font-size: 1.4rem;
    padding: 0.8rem 1.6rem;
    font-weight: 500;
    text-align: center;
    min-height: 3.2rem;
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;
    min-height: 4rem;

    /* Mobile: Meet 44px touch target */
    @media (max-width: 768px) {
      font-size: 1.5rem;
      padding: 1.3rem 1.8rem;
      min-height: 4.4rem;
    }

    @media (max-width: 480px) {
      font-size: 1.4rem;
      padding: 1.2rem 1.6rem;
    }
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;
    min-height: 4.4rem;

    /* Mobile */
    @media (max-width: 768px) {
      font-size: 1.7rem;
      padding: 1.4rem 2.6rem;
      min-height: 4.8rem;
    }

    @media (max-width: 480px) {
      font-size: 1.6rem;
      padding: 1.3rem 2.2rem;
    }
  `,
};

// ─── Variation Definitions ────────────────────────────────────────────────────

const variations: {
  primary: RuleSet<object>;
  secondary: RuleSet<object>;
  danger: RuleSet<object>;
} = {
  primary: css`
    /* Primary State: Brand 500 (matches Natours UI Kit P500) */
    background-color: var(--color-brand-500);
    color: var(--color-grey-0);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover:not(:disabled) {
      background-color: var(--color-brand-700);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    &:active:not(:disabled) {
      background-color: var(--color-brand-800);
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }

    @media (prefers-reduced-motion: reduce) {
      transition:
        background-color 0.2s ease,
        box-shadow 0.2s ease;
      &:hover:not(:disabled) {
        transform: none;
      }
      &:active:not(:disabled) {
        transform: none;
      }
    }
  `,
  secondary: css`
    background-color: transparent;
    color: var(--color-grey-800);
    border: 1px solid var(--color-grey-300);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover:not(:disabled) {
      background-color: var(--color-grey-50);
      border-color: var(--color-grey-800);
      color: var(--color-grey-900);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    &:active:not(:disabled) {
      background-color: var(--color-grey-100);
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }

    @media (prefers-reduced-motion: reduce) {
      transition:
        background-color 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease;
      &:hover:not(:disabled) {
        transform: none;
      }
      &:active:not(:disabled) {
        transform: none;
      }
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover:not(:disabled) {
      background-color: var(--color-red-800);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    &:active:not(:disabled) {
      background-color: var(--color-red-800);
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }

    @media (prefers-reduced-motion: reduce) {
      transition:
        background-color 0.2s ease,
        box-shadow 0.2s ease;
      &:hover:not(:disabled) {
        transform: none;
      }
      &:active:not(:disabled) {
        transform: none;
      }
    }
  `,
};

// ─── Type Definition ──────────────────────────────────────────────────────────

type StyledProps_Button = {
  $flex?: {
    display?: "flex" | "inline-flex";
    alignItems?: string;
    gap?: string;
    justifyContent?: string;
  };
  $size?: "small" | "medium" | "large";
  $variation?: "primary" | "secondary" | "danger";
};

// ─── Styled Component ─────────────────────────────────────────────────────────

const Button: FC<
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement> & StyledProps_Button,
    HTMLButtonElement
  >
> = styled.button`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);

  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  ${(props) => (props.$size ? sizes[props.$size] : sizes.medium)}
  ${(props) =>
    props.$variation ? variations[props.$variation] : variations.primary}

  ${({ $flex }) => {
    if ($flex?.alignItems || $flex?.justifyContent)
      return css`
        display: ${$flex.display ? $flex.display : "flex"};
        align-items: ${$flex.alignItems ? $flex.alignItems : "center"};
        gap: ${$flex.gap ? $flex.gap : "0.8rem"};
        justify-content: ${$flex.justifyContent
          ? $flex.justifyContent
          : "center"};
      `;
  }}

  &:disabled {
    background-color: var(--color-grey-300);
    color: var(--color-grey-500);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:focus-visible {
    outline: 2px solid var(--color-brand-300);
    outline-offset: 2px;
  }

  /* Mobile: Full width option via width prop */
  @media (max-width: 768px) {
    border-radius: var(--border-radius-md);

    /* If flex is set, ensure proper wrapping */
    ${({ $flex }) =>
      $flex &&
      css`
        flex-wrap: wrap;
      `}
  }

  /* Mobile: Better tap feedback */
  @media (hover: none) {
    &:active:not(:disabled) {
      opacity: 0.9;
    }
  }
`;

Button.defaultProps = {
  $flex: {
    display: "flex",
  },
  $size: "medium",
  $variation: "primary",
};

export default Button;
