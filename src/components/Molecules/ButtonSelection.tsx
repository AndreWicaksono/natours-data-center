import { FC, useState } from "react";

import styled, { css } from "styled-components";

const Container = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const ButtonSelect = styled.button<{ $isActive: boolean }>`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.$isActive &&
    css`
      background-color: var(--color-brand-300);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-300);
    color: var(--color-brand-50);
  }
`;

const ButtonSelection: FC<{
  defaultSelectedOption: string;
  onSelect?: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}> = ({ defaultSelectedOption = "", onSelect, options }) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    defaultSelectedOption
  );

  return (
    <Container>
      {options.map((option) => (
        <ButtonSelect
          key={option.value}
          $isActive={
            option.value === selectedOption ||
            (!selectedOption && option.value === defaultSelectedOption)
          }
          onClick={() => {
            setSelectedOption(option.value);

            if (onSelect) onSelect(option.value);
          }}
          disabled={option.value === selectedOption}
        >
          {option.label}
        </ButtonSelect>
      ))}
    </Container>
  );
};

export default ButtonSelection;
