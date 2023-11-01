import { DetailedHTMLProps, FC, SelectHTMLAttributes } from "react";

import styled from "styled-components";

const StyledSelect = styled.select<{ $type?: "white" }>`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.$type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

const Select: FC<
  DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > & { options: Array<{ label: string; value: string }>; type?: "white" }
> = ({ options, type = "white", value, onChange, ...props }) => {
  return (
    <StyledSelect value={value} onChange={onChange} $type={type} {...props}>
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
};

export default Select;
