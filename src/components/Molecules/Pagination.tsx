import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import styled from "styled-components";

const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const PaginationButton = styled.button`
  background-color: var(--color-grey-50);
  color: inherit;
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s;

  &:disabled {
    color: var(--color-grey-300);
  }

  &:has(span:last-child) {
    padding-left: 0.4rem;
  }

  &:has(span:first-child) {
    padding-right: 0.4rem;
  }

  & svg {
    height: 1.8rem;
    width: 1.8rem;
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-300);
    color: var(--color-brand-50);
  }
`;

const Pagination: FC<{
  next?: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & { label?: string };
  previous?: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & { label?: string };
}> = ({ next, previous }) => {
  return (
    <StyledPagination>
      <Buttons>
        <PaginationButton {...previous}>
          <ChevronLeftIcon />

          <span>{previous?.label ? previous.label : "Previous"}</span>
        </PaginationButton>

        <PaginationButton {...next}>
          <span>{next?.label ? next.label : "Next"}</span>

          <ChevronRightIcon />
        </PaginationButton>
      </Buttons>
    </StyledPagination>
  );
};

export default Pagination;
