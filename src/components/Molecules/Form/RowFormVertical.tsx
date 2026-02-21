import { DetailedHTMLProps, FC, HTMLAttributes, ReactElement } from "react";
import styled from "styled-components";

const StyledRowFormVertical = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.2rem 0;

  transition: all 0.2s ease;

  /* Mobile: Slightly more padding */
  @media (max-width: 768px) {
    padding: 1.4rem 0;
  }

  @media (max-width: 480px) {
    padding: 1.2rem 0;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--color-grey-700);
  font-size: 1.4rem;
  line-height: 1.5;

  transition: color 0.2s ease;

  /* Mobile: Slightly larger and bolder */
  @media (max-width: 768px) {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-grey-800);
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 0.6rem;

  transition: all 0.2s ease;

  /* Mobile: Card-style error for better visibility */
  @media (max-width: 768px) {
    font-size: 1.3rem;
    padding: 0.8rem 1.2rem;
    background-color: var(--color-red-100);
    border-radius: var(--border-radius-sm);
    border-left: 3px solid var(--color-red-700);
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    padding: 0.6rem 1rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
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
