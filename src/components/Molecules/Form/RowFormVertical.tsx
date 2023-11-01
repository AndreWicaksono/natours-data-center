import { DetailedHTMLProps, FC, HTMLAttributes, ReactElement } from "react";
import styled from "styled-components";

const StyledRowFormVertical = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem 0;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

const RowFormVertical: FC<{
  children: ReactElement<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  >;
  error?: string;
  label?: string;
}> = ({ label, error, children, ...restPropsRowFormVertical }) => {
  return (
    <StyledRowFormVertical {...restPropsRowFormVertical}>
      {label && <Label htmlFor={children.props.id}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledRowFormVertical>
  );
};

export default RowFormVertical;
