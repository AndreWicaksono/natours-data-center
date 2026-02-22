import styled, { keyframes } from "styled-components";

import { XMarkIcon } from "@heroicons/react/24/outline";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// ─── Search Results Container ─────────────────────────────────────────────────

export const SearchResultsHeaderBase = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.6rem;

  animation: ${fadeIn} 0.4s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1.2rem;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ─── Search Query Display ─────────────────────────────────────────────────────

export const SearchQueryDisplay = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  animation: ${slideIn} 0.4s ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const SearchQueryText = styled.h1`
  font-size: 3.2rem;
  font-weight: 700;
  color: var(--color-grey-900);
  line-height: 1.2;
  margin: 0;

  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    font-size: 2.8rem;
  }

  @media (max-width: 768px) {
    font-size: 2.4rem;
  }

  @media (max-width: 480px) {
    font-size: 2.2rem;
  }
`;

export const SearchQueryLabel = styled.span`
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--color-grey-600);

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const SearchQueryValue = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;

  padding: 0.6rem 1.6rem;

  background: linear-gradient(
    135deg,
    var(--color-brand-50) 0%,
    var(--color-brand-100) 100%
  );

  border: 1px solid var(--color-brand-200);
  border-radius: 1.2rem;

  color: var(--color-brand-700);
  font-weight: 700;

  box-shadow: 0 2px 8px rgba(85, 197, 122, 0.1);

  @media (max-width: 768px) {
    padding: 0.8rem 1.4rem;
  }
`;

export const ResultsCount = styled.p`
  font-size: 1.4rem;
  color: var(--color-grey-600);
  margin: 0;

  strong {
    font-weight: 600;
    color: var(--color-grey-800);
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

// ─── Clear Button ─────────────────────────────────────────────────────────────

export const ClearSearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;

  padding: 1.2rem 2rem;

  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-700);

  background: white;
  border: 1.5px solid var(--color-grey-300);
  border-radius: 1.2rem;

  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  white-space: nowrap;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

  svg {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-grey-600);
    transition: all 0.2s ease;
  }

  &:hover {
    background: var(--color-grey-50);
    border-color: var(--color-grey-400);
    color: var(--color-grey-900);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);

    svg {
      color: var(--color-grey-800);
      transform: rotate(90deg);
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  }

  &:focus-visible {
    outline: 2px solid var(--color-brand-400);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 1.4rem 2rem;
    font-size: 1.5rem;

    svg {
      width: 2rem;
      height: 2rem;
    }
  }

  @media (max-width: 480px) {
    padding: 1.2rem 1.8rem;
    font-size: 1.4rem;
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover,
    &:active {
      transform: none;
    }

    &:hover svg {
      transform: none;
    }
  }
`;

const SearchResultsHeader = ({
  searchQuery,
  resultsCount,
  onClear,
}: {
  searchQuery: string;
  resultsCount?: number;
  onClear: () => void;
}) => {
  return (
    <SearchResultsHeaderBase>
      <SearchQueryDisplay>
        <SearchQueryText>
          <SearchQueryLabel>Search results for:</SearchQueryLabel>
          <SearchQueryValue>"{searchQuery}"</SearchQueryValue>
        </SearchQueryText>

        {resultsCount !== undefined && (
          <ResultsCount>
            Displaying <strong>{resultsCount}</strong>{" "}
            {resultsCount === 1 ? "tour" : "tours"} on the current page
          </ResultsCount>
        )}
      </SearchQueryDisplay>

      <ClearSearchButton onClick={onClear} aria-label="Clear search">
        <XMarkIcon />
        <span>Clear search</span>
      </ClearSearchButton>
    </SearchResultsHeaderBase>
  );
};

export default SearchResultsHeader;
