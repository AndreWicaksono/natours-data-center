import { FC, InputHTMLAttributes, useId, useMemo, useState } from "react";
import styled, { css, keyframes } from "styled-components";

interface StyledInputProps {
  $hasError: boolean;
}

// ─── Animations ───────────────────────────────────────────────────────────────

const errorPulse = keyframes`
  0% { opacity: 0; transform: translateY(-5px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// ─── Container ────────────────────────────────────────────────────────────────

const FloatingInputContainer = styled.div<{ $hasError?: boolean }>`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  padding: 1.4rem 1.6rem 0.8rem 1.6rem;
  font-size: 1.6rem;
  background: var(--color-grey-0);
  border: 1px solid
    ${(props) =>
      props.$hasError ? "var(--color-red-700)" : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  outline: none;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: var(--color-grey-400);
  }

  /* UI Kit behavior: focus ring + border-color */
  &:focus {
    border-color: ${(props) =>
      props.$hasError ? "var(--color-red-700)" : "var(--color-brand-500)"};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$hasError
          ? "rgba(185, 28, 28, 0.12)"
          : "rgba(85, 197, 122, 0.1)"};
  }

  &:disabled {
    background-color: var(--color-grey-200);
    color: var(--color-grey-500);
    cursor: not-allowed;
    border-color: var(--color-grey-300);
  }

  /* Critical for UI Kit floating-label behavior */
  &::placeholder {
    color: var(--color-grey-400);
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }
`;

// ─── Floating Label ───────────────────────────────────────────────────────────

const FloatingLabel = styled.label<{
  $hasError: boolean;
}>`
  position: absolute;
  left: 1.6rem;
  top: 1.2rem;
  font-size: 1.6rem;
  font-weight: 400;
  color: var(--color-grey-500);
  background: var(--color-grey-0);
  padding: 0 0.4rem;
  border-radius: var(--border-radius-tiny);
  pointer-events: none;

  /* UI Kit: float on focus OR when input has content (placeholder is not shown) */
  ${StyledInput}:focus + &,
  ${StyledInput}:not(:placeholder-shown) + & {
    top: -0.8rem;
    font-size: 1.2rem;
    font-weight: 500;
    color: ${(p) =>
      p.$hasError ? "var(--color-red-700)" : "var(--color-brand-500)"};
  }

  transition: all 0.2s ease;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.7rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// ─── Helper Text ──────────────────────────────────────────────────────────────

const HelperText = styled.span<{ $isError?: boolean }>`
  display: block;
  margin-top: 0.6rem;

  font-size: 1.3rem;
  line-height: 1.4;
  color: ${(p) =>
    p.$isError ? "var(--color-red-600)" : "var(--color-grey-600)"};

  animation: ${errorPulse} 0.3s ease-out;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-top: 0.8rem;
    padding: 0.6rem 1rem;

    ${(p) =>
      p.$isError &&
      css`
        background: var(--color-red-100);
        border-radius: 0.4rem;
        border-left: 3px solid var(--color-red-600);
      `}
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ─── Character Counter ────────────────────────────────────────────────────────

const CharacterCounter = styled.span<{ $isNearLimit: boolean }>`
  position: absolute;
  right: 0;
  bottom: -2.2rem;

  font-size: 1.2rem;
  color: ${(p) =>
    p.$isNearLimit ? "var(--color-yellow-700)" : "var(--color-grey-500)"};

  transition: color 0.2s ease;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    bottom: -2.4rem;
  }
`;

// ─── Required Indicator ───────────────────────────────────────────────────────

const RequiredIndicator = styled.span`
  color: var(--color-red-500);
  margin-left: 0.2rem;
`;

// ─── Component Props ──────────────────────────────────────────────────────────

interface FloatingInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label: string;
  error?: string;
  helperText?: string;
  showCharacterCount?: boolean;
  maxLength?: number;
  required?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const FloatingInput: FC<FloatingInputProps> = ({
  label,
  error,
  helperText,
  showCharacterCount = false,
  maxLength,
  required = false,
  value,
  onChange,
  disabled,
  id,
  defaultValue,
  placeholder,
  ...rest
}) => {
  const reactId = useId();
  const inputId = useMemo(
    () => id ?? `floating-input-${reactId}`,
    [id, reactId]
  );

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(() => {
    return typeof defaultValue === "string" ? defaultValue : "";
  });

  const hasError = !!error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  };

  const currentValue = isControlled ? value : internalValue;

  const characterCount = currentValue.length;
  const isNearLimit = maxLength ? characterCount >= maxLength * 0.9 : false;

  const helpTextId = `${inputId}-help`;
  const describedById = error || helperText ? helpTextId : undefined;
  const computedPlaceholder = placeholder ?? " ";

  return (
    <FloatingInputContainer $hasError={hasError}>
      <StyledInput
        {...rest}
        $hasError={hasError}
        id={inputId}
        aria-invalid={hasError || undefined}
        aria-describedby={describedById}
        placeholder={computedPlaceholder}
        value={currentValue}
        onChange={handleChange}
        maxLength={maxLength}
        disabled={disabled}
      />

      <FloatingLabel $hasError={hasError} htmlFor={inputId}>
        {label}
        {required && <RequiredIndicator>*</RequiredIndicator>}
      </FloatingLabel>

      {(error || helperText) && (
        <HelperText id={helpTextId} $isError={hasError}>
          {error || helperText}
        </HelperText>
      )}

      {showCharacterCount && maxLength && (
        <CharacterCounter $isNearLimit={isNearLimit}>
          {characterCount} / {maxLength}
        </CharacterCounter>
      )}
    </FloatingInputContainer>
  );
};

export default FloatingInput;
