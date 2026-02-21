import { FC } from "react";
import styled, { keyframes } from "styled-components";

// ─── Design tokens ────────────────────────────────────────────────────────────

const t = {
  green400: "#55c57a",
  green500: "#28b485",
  white: "#ffffff",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate500: "#64748b",
  successLight: "#e6f7f0",
  rFull: "9999px",
  shSm: "0 1px 2px rgba(0,0,0,0.05)",
  font: `"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
};

const bp = {
  mobile: "@media (max-width: 768px)",
};

const slideIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.div`
  position: relative;
  /* FIXED: Changed to grid to ensure all slots are exactly the same width */
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;

  background: ${t.slate100};
  border: 1px solid ${t.slate200};
  border-radius: ${t.rFull};
  padding: 0.4rem;
  gap: 0.4rem; /* Matching the gap and padding for easier math */

  box-shadow: ${t.shSm};
  animation: ${slideIn} 0.3s ease-out;

  ${bp.mobile} {
    width: 100%;
  }
`;

const ActiveIndicator = styled.div<{
  $index: number;
  $count: number;
}>`
  position: absolute;
  top: 0.4rem;
  bottom: 0.4rem;
  left: 0.4rem;
  z-index: 1;

  /* FORMULA FIX: 
    Width = (Total Container Width - (Padding * 2) - (Gaps between items)) / Count
  */
  width: calc(
    (100% - (0.4rem * 2) - (0.4rem * (${(p) => p.$count} - 1))) /
      ${(p) => p.$count}
  );

  /* TRANSLATION FIX: 
    We move by 100% of the indicator's width PLUS one full gap for every index.
  */
  transform: translateX(calc(${(p) => p.$index} * (100% + 0.4rem)));

  background: linear-gradient(135deg, ${t.green400} 0%, ${t.green500} 100%);
  border-radius: ${t.rFull};
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const ButtonSelect = styled.button<{ $isActive: boolean }>`
  position: relative;
  z-index: 2;
  background-color: transparent;
  border: none;
  border-radius: ${t.rFull};

  font-family: ${t.font};
  font-weight: ${(props) => (props.$isActive ? 700 : 500)};
  font-size: 1.2rem;
  padding: 0.5rem 1.6rem;
  min-height: 3.2rem;
  min-width: 8rem; /* Ensure buttons have enough space for "Published" text */

  cursor: pointer;
  white-space: nowrap;
  color: ${(props) => (props.$isActive ? t.white : t.slate500)};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    color: ${(props) => (props.$isActive ? t.white : t.green500)};
  }

  ${bp.mobile} {
    min-width: 0;
    padding: 0.5rem 1rem;
  }
`;

// ─── Main Component ───────────────────────────────────────────────────────────

const ButtonSelection: FC<{
  onSelect: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: "all" | "draft" | "published";
}> = ({ onSelect, options, value }) => {
  const activeIndex = options.findIndex((opt) => opt.value === value);

  return (
    <Container>
      <ActiveIndicator $index={activeIndex} $count={options.length} />
      {options.map((option) => (
        <ButtonSelect
          key={option.value}
          $isActive={option.value === value}
          onClick={() => onSelect(option.value)}
          disabled={option.value === value}
          type="button"
        >
          {option.label}
        </ButtonSelect>
      ))}
    </Container>
  );
};

export default ButtonSelection;
