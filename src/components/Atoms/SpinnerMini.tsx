import styled, { keyframes } from "styled-components";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;

const SpinnerMini = styled(ArrowPathIcon)`
  width: 2.4rem;
  height: 2.4rem;
  animation: ${rotate} 1.5s infinite linear;
`;

export default SpinnerMini;
