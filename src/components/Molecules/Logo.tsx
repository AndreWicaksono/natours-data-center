import { FC } from "react";
import styled from "styled-components";

import Heading from "src/components/Atoms/Heading";

import NatoursLogo from "src/assets/SVG/logo-green-small-2x.svg";

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledLogo = styled.div`
  height: 3.2rem;
  width: 16rem;

  text-align: center;
`;

const FloatingHeading = styled(Heading)`
  display: inline-block;
  font-size: 1.6rem;

  position: relative;
  right: -22.5%;
  bottom: 1.4rem;

  white-space: nowrap;
`;

const Logo: FC = () => {
  return (
    <Container>
      <StyledLogo>
        <img alt="Natours Logo" src={NatoursLogo} height={32} />

        <FloatingHeading as="h2">Data Center</FloatingHeading>
      </StyledLogo>
    </Container>
  );
};

export default Logo;
