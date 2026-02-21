import { FC, InputHTMLAttributes } from "react";
import styled from "styled-components";

interface ToggleSwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  color?: string;
  height?: number;
  label?: string;
  width?: number;
}

const ToggleSwitchStyled = styled.div<{
  $color: string;
  $height: number;
  $width: number;
}>`
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;

  /* Hide default HTML checkbox */
  input {
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: 1;
    opacity: 0;
    cursor: pointer;

    /* Better accessibility */
    &:focus + span {
      outline: 2px solid ${({ $color }) => $color};
      outline-offset: 2px;
    }
  }

  /* The slider */
  span {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    cursor: pointer;
    background-color: var(--color-grey-400);
    border-radius: 2.4rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);

    &:hover {
      background-color: var(--color-grey-500);
    }
  }

  /* The circle/knob */
  span:before {
    content: "";
    height: ${({ $height }) => `calc((${$height}rem / 10) * 0.765)`};
    width: ${({ $height }) => `calc((${$height}rem / 10) * 0.765)`};
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0.4rem;
    background-color: white;
    border-radius: 50%;
    margin: auto 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  input:checked + span {
    background-color: ${({ $color }) => $color};
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);

    &:hover {
      background-color: var(--color-brand-700);
    }
  }

  input:checked + span:before {
    transform: translateX(
      ${({ $height }) => `calc((${$height}rem / 10) * 0.765)`}
    );
  }

  /* Active state feedback */
  input:active + span:before {
    width: ${({ $height }) => `calc((${$height}rem / 10) * 0.9)`};
  }

  .container-input {
    position: relative;
    display: inline-block;
    height: ${({ $height }) => `calc(${$height}rem / 10)`};
    width: ${({ $width }) => `calc(${$width}rem / 10)`};
    flex-shrink: 0;
  }

  label {
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--color-grey-700);
    user-select: none;
    cursor: pointer;
  }

  /* Mobile: Larger switch for better touch targets */
  @media (max-width: 768px) {
    .container-input {
      /* Increase size by 1.2x on mobile */
      height: ${({ $height }) => `calc((${$height}rem / 10) * 1.2)`};
      width: ${({ $width }) => `calc((${$width}rem / 10) * 1.2)`};
    }

    span:before {
      height: ${({ $height }) => `calc((${$height}rem / 10) * 0.765 * 1.2)`};
      width: ${({ $height }) => `calc((${$height}rem / 10) * 0.765 * 1.2)`};
      left: 0.5rem;
    }

    input:checked + span:before {
      transform: translateX(
        ${({ $height }) => `calc((${$height}rem / 10) * 0.765 * 1.2)`}
      );
    }

    input:active + span:before {
      width: ${({ $height }) => `calc((${$height}rem / 10) * 0.9 * 1.2)`};
    }

    label {
      font-size: 1.5rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    span,
    span:before {
      transition:
        background-color 0.2s ease,
        box-shadow 0.2s ease;
    }

    input:checked + span:before {
      transition: transform 0.2s ease;
    }
  }
`;

const ToggleSwitch: FC<ToggleSwitchProps> = ({
  color = "var(--color-brand-300)",
  height = 34,
  label,
  id = "input-toggle-switch",
  width = height * 1.765,
  ...props
}) => {
  return (
    <ToggleSwitchStyled $color={color} $height={height} $width={width}>
      {label && <label htmlFor={id}>{label}</label>}

      <div className="container-input">
        <input type="checkbox" id={id} {...props} />
        <span />
      </div>
    </ToggleSwitchStyled>
  );
};

export default ToggleSwitch;
