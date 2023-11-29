import { DetailedHTMLProps, FC, HTMLAttributes, ReactElement } from "react";
import styled from "styled-components";

export const RowFormPreviewMultipleImagesUpload = styled.div`
  display: flex;

  overflow-x: scroll;
  overflow-y: hidden;

  & > *:not(:last-child) {
    padding-right: 1.6rem;

    button {
      right: 2rem;
    }
  }

  & > *:last-child {
    button {
      right: 0.4rem;
    }
  }

  button {
    position: absolute;
    top: 0.4rem;

    z-index: 1;

    background-color: transparent;
    border: none;
    margin: 0;
    padding: 0;
  }
`;

const StyledRowFormHorizontal = styled.div<{
  $grid?: {
    display?: "grid" | "inline-grid";
    justifyItems?: string;
    templateColumns?: string;
  };
}>`
  display: ${({ $grid }) => ($grid?.display ? $grid.display : "grid")};
  align-items: center;
  grid-template-columns: ${({ $grid }) =>
    $grid?.templateColumns ? $grid.templateColumns : "24rem 1fr 1.2fr"};
  gap: 2.4rem;
  justify-items: ${({ $grid }) =>
    $grid?.justifyItems ? $grid.justifyItems : "stretch"};

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

export const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

const RowFormHorizontal: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    children: ReactElement;
    error?: string;
    grid?: {
      display?: "grid" | "inline-grid";
      justifyItems?: string;
      templateColumns?: string;
    };
    label?: string;
  }
> = ({ children, error, grid, label }) => {
  if (!children) return null;

  return (
    <StyledRowFormHorizontal $grid={grid}>
      {label && <Label htmlFor={children.props.id}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledRowFormHorizontal>
  );
};

export default RowFormHorizontal;
