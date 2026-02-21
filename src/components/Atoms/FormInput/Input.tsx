import styled from "styled-components";

const Input = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);

  font-size: 1.4rem;
  line-height: 1.5;
  color: var(--color-grey-700);

  width: 100%;

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
  }

  &::placeholder {
    color: var(--color-grey-400);
  }

  /* Tablet: Slightly larger */
  @media (max-width: 1024px) {
    padding: 0.9rem 1.3rem;
    font-size: 1.5rem;
  }

  /* Mobile: Proper touch targets (min 44px height) */
  @media (max-width: 768px) {
    padding: 1.2rem 1.4rem;
    font-size: 1.6rem;
    min-height: 4.4rem;
    border-radius: var(--border-radius-md);
  }

  /* Small: Maintain touch targets */
  @media (max-width: 480px) {
    padding: 1.1rem 1.2rem;
    font-size: 1.5rem;
  }

  /* Number input: Remove spinner on mobile for better UX */
  &[type="number"] {
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }
`;

export default Input;
