import styled, { css, keyframes } from "styled-components";

const animationShimmer = keyframes`
  0% {
    background-position: -46.8rem 0;
  }
  
  100% {
    background-position: 46.8rem 0; 
  }
`;

export const LoadingBar = styled.div<{
  $borderRadius?: string;
  $css?: string;
  $height?: string;
  $width?: string;
}>`
  ${({ $height = "2.4rem", $width = "100%" }) => {
    return css`
      height: ${$height};
      width: ${$width};
    `;
  }}

  display: inline-block;

  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${animationShimmer};
  animation-timing-function: linear;

  -webkit-animation-duration: 1s;
  -webkit-animation-fill-mode: forwards;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-name: ${animationShimmer};
  -webkit-animation-timing-function: linear;

  background-color: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-repeat: no-repeat;
  background-size: 80rem 10.4rem;
  border-radius: ${({ $borderRadius = 0 }) => $borderRadius};

  ${({ $css }) => $css ?? ""};
`;
