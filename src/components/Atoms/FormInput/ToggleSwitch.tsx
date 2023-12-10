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

  /* Hide default HTML checkbox */
  input {
    height: 100%;
    width: 100%;

    position: absolute;
    z-index: 1;

    opacity: 0;
  }

  /* The slider */
  span {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    cursor: pointer;
    background-color: #ccc;
    border-radius: 2.4rem;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

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
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + span {
    background-color: ${({ $color }) => $color};
  }

  input:focus + span {
    box-shadow: 0 0 1px ${({ $color }) => $color};
  }

  input:checked + span:before {
    -webkit-transform: translateX(
      ${({ $height }) => `calc((${$height}rem / 10) * 0.765)`}
    );
    -ms-transform: translateX(
      ${({ $height }) => `calc((${$height}rem / 10) * 0.765)`}
    );
    transform: translateX(
      ${({ $height }) => `calc((${$height}rem / 10) * 0.765)`}
    );
  }

  .container-input {
    /* The switch - the box around the slider */
    position: relative;
    display: inline-block;

    height: ${({ $height }) => `calc(${$height}rem / 10)`};
    width: ${({ $width }) => `calc(${$width}rem / 10)`};
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
