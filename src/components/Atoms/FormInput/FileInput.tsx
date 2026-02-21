import styled from "styled-components";

export const ImgContainer = styled.div`
  position: relative;
  display: inline-block;
  flex: 0 0 24rem;
  border-radius: var(--border-radius-md);
  overflow: hidden;

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  img {
    max-width: unset;
    display: block;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  /* Tablet: Adjust size */
  @media (max-width: 1024px) {
    flex: 0 0 20rem;
  }

  /* Mobile: Full width in grid */
  @media (max-width: 768px) {
    flex: 1 1 100%;
    max-width: 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow 0.2s ease;
    &:hover {
      transform: none;
      img {
        transform: none;
      }
    }
  }
`;

const FileInput = styled.input.attrs({ type: "file" })`
  border-radius: var(--border-radius-sm);
  color: transparent;
  font-size: 1.4rem;
  overflow: hidden;
  width: 100%;

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &::file-selector-button {
    font: inherit;
    font-weight: 500;
    padding: 0.8rem 1.2rem;
    margin-right: 1.2rem;
    border-radius: var(--border-radius-sm);
    border: none;
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);
    cursor: pointer;

    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);

    &:hover {
      background-color: var(--color-brand-700);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    &:active {
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }
  }

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 1.5rem;

    &::file-selector-button {
      padding: 0.9rem 1.4rem;
    }
  }

  /* Mobile: Better touch targets and full-width button */
  @media (max-width: 768px) {
    font-size: 1.6rem;

    &::file-selector-button {
      padding: 1.2rem 2rem;
      min-height: 4.4rem;
      font-size: 1.5rem;
      border-radius: var(--border-radius-md);

      /* Full width on very small screens */
      @media (max-width: 480px) {
        width: 100%;
        margin-right: 0;
        margin-bottom: 0.8rem;
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &::file-selector-button {
      transition:
        background-color 0.2s ease,
        box-shadow 0.2s ease;

      &:hover {
        transform: none;
      }

      &:active {
        transform: none;
      }
    }
  }
`;

export default FileInput;
