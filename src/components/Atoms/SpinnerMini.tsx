import { ArrowPathIcon } from "@heroicons/react/20/solid";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;

const SpinnerMini = styled(ArrowPathIcon)`
  height: ${({ height }) => (height ? height : "2.4rem")};
  width: ${({ width }) => (width ? width : "2.4rem")};

  animation: ${rotate} 1.5s infinite linear;
`;

export default SpinnerMini;
