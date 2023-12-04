import { FC } from "react";

import styled from "styled-components";

import FormAccount from "src/components/Molecules/ComposedAsFeatures/FormAccount";

const ContainerInformation = styled.div`
  display: flex;
  justify-content: center;
`;

const TemplatePageAccount: FC = () => {
  return (
    <ContainerInformation>
      <FormAccount />
    </ContainerInformation>
  );
};

export default TemplatePageAccount;
