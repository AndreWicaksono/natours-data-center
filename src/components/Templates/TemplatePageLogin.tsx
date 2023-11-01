import { FC } from "react";
import styled from "styled-components";

import Heading from "src/components/Atoms/Heading";
import FormLogin from "src/components/Molecules/ComposedAsFeatures/FormLogin";
import Logo from "src/components/Molecules/Logo";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

const TemplatePageLogin: FC = () => {
  return (
    <LoginLayout>
      <Logo />
      <Heading as="h4">Log in to your account</Heading>
      <FormLogin boxShadow="shadow-lg" />
    </LoginLayout>
  );
};

export default TemplatePageLogin;
