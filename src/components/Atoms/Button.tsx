import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";
import styled, { css, RuleSet } from "styled-components";

const sizes: {
  small: RuleSet<object>;
  medium: RuleSet<object>;
  large: RuleSet<object>;
} = {
  small: css`
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;
  `,
};

const variations: {
  primary: RuleSet<object>;
  secondary: RuleSet<object>;
  danger: RuleSet<object>;
} = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-300);

    &:hover {
      background-color: var(--color-brand-700);
    }
  `,
  secondary: css`
    color: var(--color-grey-600);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);

    &:hover {
      background-color: var(--color-grey-50);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
};

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

const Button: FC<
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement> & StyledProps_Button,
    HTMLButtonElement
  >
> = styled.button`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);

  ${(props) => (props.$size ? sizes[props.$size] : sizes.medium)}
  ${(props) =>
    props.$variation ? variations[props.$variation] : variations.primary}

  ${({ $flex }) => {
    if ($flex?.alignItems || $flex?.justifyContent)
      return css`
        display: ${$flex.display ? $flex.display : "flex"};
        align-items: ${$flex.alignItems ? $flex.alignItems : "flex-start"};
        gap: ${$flex.gap ? $flex.gap : 0};
        justify-content: ${$flex.justifyContent
          ? $flex.justifyContent
          : "flex-start"};
      `;
  }}

  &:disabled {
    background-color: var(--color-grey-300);
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
