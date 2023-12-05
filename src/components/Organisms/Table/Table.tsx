import { CSSProperties, FC, ReactNode, createContext, useContext } from "react";

import styled from "styled-components";

import { generateCSSFromCSSProperties } from "src/utils/Object";

const StyledTable = styled.div<{ $cssOption?: CSSProperties }>`
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;

  ${({ $cssOption }) => {
    if ($cssOption) {
      return generateCSSFromCSSProperties($cssOption);
    }

    if (!$cssOption || ($cssOption && !$cssOption["overflow"])) {
      return "overflow: hidden;";
    }

    return "";
  }};
`;

const CommonRow = styled.div<{
  $columns: string;
  $cssOption?: CSSProperties;
}>`
  ${({ $cssOption }) =>
    $cssOption ? generateCSSFromCSSProperties($cssOption) : ""}

  display: grid;
  grid-template-columns: ${(props) => props.$columns};
  column-gap: 2.4rem;
  align-items: center;
  transition: none;
`;

const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;

  background-color: var(--color-zinc-100);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
`;

const StyledRow = styled(CommonRow)`
  padding: 1.2rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const StyledBody = styled.section`
  margin: 0.4rem 0;
`;

const Footer = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;

  /* This will hide the footer when it contains no child elements. Possible thanks to the parent selector :has 🎉 */
  &:not(:has(*)) {
    display: none;
  }
`;

const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`;

const TableContext = createContext<{ columns: string }>({
  columns: "6.4rem 1.8fr 2.2fr 1fr 1fr 1fr",
});

const Table = ({
  children,
  columns = "6.4rem 1.8fr 2.2fr 1fr 1fr 1fr",
  cssOption,
  role,
}: {
  children: ReactNode;
  columns?: string;
  cssOption?: CSSProperties;
  role: string;
}) => {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable $cssOption={cssOption} role={role}>
        {children}
      </StyledTable>
    </TableContext.Provider>
  );
};

const Header = ({
  children,
  cssOption,
}: {
  children: ReactNode;
  cssOption?: CSSProperties;
}) => {
  const { columns } = useContext(TableContext);

  return (
    <StyledHeader
      $columns={columns}
      $cssOption={cssOption}
      as="header"
      role="row"
    >
      {children}
    </StyledHeader>
  );
};
const Row: FC<{
  children: ReactNode;
  cssOption?: CSSProperties;
}> = ({ children, cssOption }) => {
  const { columns } = useContext(TableContext);

  return (
    <StyledRow $columns={columns} $cssOption={cssOption} role="row">
      {children}
    </StyledRow>
  );
};

const Body = ({
  children,
  isNoData,
}: {
  children: ReactNode;
  isNoData: boolean;
}) => {
  if (isNoData) return <Empty>No data to show at the moment</Empty>;

  return <StyledBody>{children}</StyledBody>;
};

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;

export default Table;
