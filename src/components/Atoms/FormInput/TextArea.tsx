import { DetailedHTMLProps, FC, TextareaHTMLAttributes } from "react";
import styled from "styled-components";

const Textarea: FC<
  DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >
> = styled.textarea`
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);

  width: 100%;
  height: 8rem;
  min-height: 8rem;

  font-size: 1.4rem;
  line-height: 1.6;
  color: var(--color-grey-700);
  font-family: inherit;

  resize: vertical;

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover:not(:disabled) {
    border-color: var(--color-grey-400);
  }

  &:focus {
    outline: 2px solid var(--color-brand-300);
    outline-offset: -1px;
    border-color: var(--color-brand-300);
    box-shadow: 0 0 0 3px rgba(85, 197, 122, 0.1);
  }

  &:disabled {
    background-color: var(--color-grey-200);
    color: var(--color-grey-500);
    cursor: not-allowed;
    border-color: var(--color-grey-300);
    resize: none;
  }

  &::placeholder {
    color: var(--color-grey-400);
  }

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 0.9rem 1.3rem;
    font-size: 1.5rem;
    height: 10rem;
    min-height: 10rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1.2rem 1.4rem;
    font-size: 1.6rem;
    height: 12rem;
    min-height: 12rem;
    border-radius: var(--border-radius-md);
  }

  /* Small */
  @media (max-width: 480px) {
    padding: 1rem 1.2rem;
    font-size: 1.5rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }
`;

export default Textarea;
