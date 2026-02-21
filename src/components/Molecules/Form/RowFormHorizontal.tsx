import { DetailedHTMLProps, FC, HTMLAttributes, ReactElement } from "react";

import { CheckCircleIcon } from "@heroicons/react/20/solid";
import styled from "styled-components";

import SpinnerMini from "src/components/Atoms/SpinnerMini";

// ─── Photo Preview Container ──────────────────────────────────────────────────

export const RowFormPreviewMultipleImagesUpload = styled.div`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 1.6rem;
  padding-bottom: 0.8rem; /* Space for scrollbar */

  /* Smooth scrolling */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    height: 0.6rem;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-100);
    border-radius: 1rem;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-400);
    border-radius: 1rem;

    &:hover {
      background: var(--color-grey-500);
    }
  }

  /* Mobile: Grid layout instead of horizontal scroll */
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    gap: 1.2rem;
    overflow-x: visible;
    padding-bottom: 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
    gap: 1rem;
  }

  /* Delete button positioning */
  button {
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
    z-index: 1;

    background-color: transparent;
    border: none;
    margin: 0;
    padding: 0.4rem;

    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: var(--border-radius-sm);

    &:hover {
      background-color: rgba(255, 255, 255, 0.9);
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }

    /* Mobile: Larger touch target */
    @media (max-width: 768px) {
      padding: 0.6rem;
      top: 0.6rem;
      right: 0.6rem;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: background-color 0.2s ease;
      &:hover {
        transform: none;
      }
      &:active {
        transform: none;
      }
    }
  }
`;

// ─── Main Form Row ────────────────────────────────────────────────────────────

const StyledRowFormHorizontal = styled.div<{
  $grid?: {
    display?: "grid" | "inline-grid";
    justifyItems?: string;
    templateColumns?: string;
  };
  $isFullWidth?: boolean;
}>`
  display: ${({ $grid }) => ($grid?.display ? $grid.display : "grid")};
  align-items: ${({ $isFullWidth }) =>
    $isFullWidth ? "flex-start" : "center"};
  gap: 2.4rem;
  justify-items: ${({ $grid }) =>
    $grid?.justifyItems ? $grid.justifyItems : "stretch"};

  /* FIXED: Better grid proportions - inputs now get minimum 30rem width */
  grid-template-columns: ${({ $grid, $isFullWidth }) => {
    if ($isFullWidth) {
      return "1fr"; // Full width for Description
    }
    if ($grid?.templateColumns) {
      return $grid.templateColumns; // Custom grid if provided
    }
    // Default: 20rem label | min 30rem input | ~20rem validation
    return "20rem minmax(30rem, 1fr) minmax(20rem, 0.8fr)";
  }};

  padding: 1.2rem 0;
  transition: all 0.2s ease;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  /* Tablet: Reduce label width */
  @media (max-width: 1024px) {
    grid-template-columns: ${({ $grid, $isFullWidth }) => {
      if ($isFullWidth) return "1fr";
      if ($grid?.templateColumns) return $grid.templateColumns;
      return "16rem minmax(25rem, 1fr) minmax(18rem, 0.8fr)";
    }};
    gap: 2rem;
  }

  /* Mobile: Stack vertically */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1.6rem 0;
    align-items: flex-start;

    &:not(:last-child) {
      border-bottom: 1px solid var(--color-grey-200);
      padding-bottom: 2rem;
    }
  }

  /* Small: Tighter spacing */
  @media (max-width: 480px) {
    gap: 0.8rem;
    padding: 1.4rem 0;

    &:not(:last-child) {
      padding-bottom: 1.6rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// ─── Label ────────────────────────────────────────────────────────────────────

export const Label = styled.label<{ $isFullWidth?: boolean }>`
  font-weight: 500;
  color: var(--color-grey-700);
  font-size: 1.4rem;
  line-height: 1.5;
  transition: color 0.2s ease;

  /* Full-width fields: Label appears above content */
  ${({ $isFullWidth }) =>
    $isFullWidth &&
    `
    grid-column: 1 / -1;
    margin-bottom: 0.4rem;
  `}

  /* Mobile: Slightly larger, bolder */
  @media (max-width: 768px) {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-grey-800);
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// ─── Error Message ────────────────────────────────────────────────────────────

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 0.6rem;

  transition: all 0.2s ease;

  /* Mobile: Full width, more visible */
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

// ─── Validation Icon Container ───────────────────────────────────────────────

const ValidationContainer = styled.div<{ $isFullWidth?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 2rem;

  /* Full-width fields: Validation appears below input */
  ${({ $isFullWidth }) =>
    $isFullWidth &&
    `
    grid-column: 1 / -1;
    margin-top: 0.4rem;
  `}

  /* Mobile: Move to end of input row */
  @media (max-width: 768px) {
    justify-content: flex-end;
    margin-top: -0.4rem;
  }
`;

// ─── Input Container (for full-width fields) ─────────────────────────────────

const InputContainer = styled.div`
  grid-column: 1 / -1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

// ─── Main Component ───────────────────────────────────────────────────────────

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
    loading?: boolean;
    showValidIcon?: boolean;
    isFullWidth?: boolean; // NEW: For Description, Notes, etc.
  }
> = ({
  children,
  error,
  grid,
  label,
  loading,
  showValidIcon = false,
  isFullWidth = false,
}) => {
  if (!children) return null;

  // Full-width layout (Description, Comments, Notes)
  if (isFullWidth) {
    return (
      <StyledRowFormHorizontal $grid={grid} $isFullWidth={true}>
        {label && (
          <Label htmlFor={children.props.id} $isFullWidth={true}>
            {label}
          </Label>
        )}

        <InputContainer>{children}</InputContainer>

        <ValidationContainer $isFullWidth={true}>
          {error && !loading && <Error>{error}</Error>}

          {loading && showValidIcon && (
            <SpinnerMini height={"1.6rem"} width={"1.6rem"} />
          )}

          {showValidIcon && !error && !loading && (
            <CheckCircleIcon
              fill="var(--color-brand-300)"
              height={20}
              width={20}
              style={{ transition: "all 0.2s ease" }}
            />
          )}
        </ValidationContainer>
      </StyledRowFormHorizontal>
    );
  }

  // Regular 3-column layout (Name, Price, City, etc.)
  return (
    <StyledRowFormHorizontal $grid={grid}>
      {label && <Label htmlFor={children.props.id}>{label}</Label>}

      {children}

      <ValidationContainer>
        {error && !loading && <Error>{error}</Error>}

        {loading && showValidIcon && (
          <SpinnerMini height={"1.6rem"} width={"1.6rem"} />
        )}

        {showValidIcon && !error && !loading && (
          <CheckCircleIcon
            fill="var(--color-brand-300)"
            height={20}
            width={20}
            style={{ transition: "all 0.2s ease" }}
          />
        )}
      </ValidationContainer>
    </StyledRowFormHorizontal>
  );
};

export default RowFormHorizontal;
