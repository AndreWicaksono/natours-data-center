import { FC, useState, useRef, useEffect, ChangeEvent } from "react";
import styled, { css, keyframes } from "styled-components";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

// ─── Animations ───────────────────────────────────────────────────────────────

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ─── Styled Components ────────────────────────────────────────────────────────

const SelectContainer = styled.div`
  position: relative;
  display: inline-block;
  min-width: 28rem;
  user-select: none;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SelectHeader = styled.div<{ $isOpen: boolean; $type: "white" }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.2rem;
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-grey-300);
  background-color: ${(props) =>
    props.$type === "white" ? "var(--color-grey-0)" : "var(--color-grey-50)"};
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-brand-500);
  }

  ${(props) =>
    props.$isOpen &&
    css`
      border-color: var(--color-brand-600);
      box-shadow: 0 0 0 3px var(--color-brand-100);
    `}
`;

const LabelGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--color-grey-700);

  & svg {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-grey-400);
  }
`;

const OptionsList = styled.ul`
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  width: 100%;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  max-height: 30rem;
  overflow-y: auto;
  padding: 0.4rem;
  animation: ${slideDown} 0.2s ease-out;
`;

const OptionItem = styled.li<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  font-size: 1.4rem;
  cursor: pointer;
  border-radius: var(--border-radius-sm);
  color: var(--color-grey-700);
  transition: all 0.1s ease;

  &:hover {
    background-color: var(--color-grey-50);
  }

  ${(props) =>
    props.$isSelected &&
    css`
      background-color: var(--color-brand-50);
      color: var(--color-brand-700);
      font-weight: 600;
      & svg {
        color: var(--color-brand-500);
      }
    `}

  & svg {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-grey-400);
  }
`;

const StyledChevron = styled(ChevronDownIcon)<{ $isOpen: boolean }>`
  width: 2rem;
  height: 2rem;
  color: var(--color-grey-400);
  transition: transform 0.3s ease;
  ${(props) => props.$isOpen && "transform: rotate(180deg);"}
`;

// ─── Main Component ───────────────────────────────────────────────────────────

type OptionType = {
  icon?: React.ElementType;
  label: string;
  value: string;
};

interface SelectProps {
  options: OptionType[];
  value: string | number | readonly string[] | undefined;
  // Use the legacy prop type as requested
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  type?: "white";
  placeholder?: string;
  name?: string;
}

const Select: FC<SelectProps> = ({
  options,
  value,
  onChange,
  type = "white",
  placeholder = "Select option...",
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── Event Simulator ───────────────────────────────────────────────────────
  const handleOptionClick = (selectedValue: string) => {
    if (!onChange) return;

    // Create a mock Synthetic Event to satisfy the legacy ChangeEventHandler
    const event = {
      target: {
        name: name,
        value: selectedValue,
      },
      currentTarget: {
        name: name,
        value: selectedValue,
      },
    } as ChangeEvent<HTMLSelectElement>;

    onChange(event);
    setIsOpen(false);
  };

  return (
    <SelectContainer ref={containerRef}>
      <SelectHeader
        $isOpen={isOpen}
        $type={type}
        onClick={() => setIsOpen(!isOpen)}
      >
        <LabelGroup>
          {selectedOption?.icon && <selectedOption.icon />}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </LabelGroup>
        <StyledChevron $isOpen={isOpen} />
      </SelectHeader>

      {isOpen && (
        <OptionsList>
          {options.map((option) => (
            <OptionItem
              key={option.value}
              $isSelected={value === option.value}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.icon && <option.icon />}
              <span>{option.label}</span>
            </OptionItem>
          ))}
        </OptionsList>
      )}
    </SelectContainer>
  );
};

export default Select;
