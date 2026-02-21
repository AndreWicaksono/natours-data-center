import styled, { css } from "styled-components";

const Heading = styled.h1`
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 3rem;
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: -0.02em;

      /* Tablet */
      @media (max-width: 1024px) {
        font-size: 2.8rem;
      }

      /* Mobile */
      @media (max-width: 768px) {
        font-size: 2.4rem;
      }

      /* Small */
      @media (max-width: 480px) {
        font-size: 2.2rem;
      }
    `}

  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 600;
      line-height: 1.3;
      letter-spacing: -0.01em;

      /* Tablet */
      @media (max-width: 1024px) {
        font-size: 1.9rem;
      }

      /* Mobile */
      @media (max-width: 768px) {
        font-size: 1.8rem;
      }

      /* Small */
      @media (max-width: 480px) {
        font-size: 1.7rem;
      }
    `}
    
  ${(props) =>
    props.as === "h3" &&
    css`
      font-size: 2rem;
      font-weight: 500;
      line-height: 1.3;

      /* Tablet */
      @media (max-width: 1024px) {
        font-size: 1.9rem;
      }

      /* Mobile */
      @media (max-width: 768px) {
        font-size: 1.8rem;
      }

      /* Small */
      @media (max-width: 480px) {
        font-size: 1.7rem;
      }
    `}
    
  ${(props) =>
    props.as === "h4" &&
    css`
      font-size: 3rem;
      font-weight: 600;
      text-align: center;
      line-height: 1.2;
      letter-spacing: -0.02em;

      /* Tablet */
      @media (max-width: 1024px) {
        font-size: 2.6rem;
      }

      /* Mobile */
      @media (max-width: 768px) {
        font-size: 2.2rem;
      }

      /* Small */
      @media (max-width: 480px) {
        font-size: 2rem;
      }
    `}
    
  line-height: 1.4;
  color: var(--color-grey-900);
  margin: 0;

  transition: color 0.2s ease;
`;

export default Heading;
