import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;

const Spinner = styled.div`
  margin: 4.8rem auto;

  width: 6.4rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(farthest-side, var(--color-brand-300) 94%, #0000) top/1rem
      1rem no-repeat,
    conic-gradient(#0000 30%, var(--color-brand-300));
  mask: radial-gradient(farthest-side, #0000 calc(100% - 1rem), #000 0);
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 1rem), #000 0);
  animation: ${rotate} 1.5s infinite linear;
`;

export default Spinner;
