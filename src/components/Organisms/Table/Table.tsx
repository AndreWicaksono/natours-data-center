import { CSSProperties, FC, ReactNode, createContext, useContext } from "react";
import styled from "styled-components";
import { generateCSSFromCSSProperties } from "src/utils/Object";

// ─── Enhanced Table Container ─────────────────────────────────────────────────

const StyledTable = styled.div<{ $cssOption?: CSSProperties }>`
  /* Modern card-style table */
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: 1.2rem;

  /* Soft shadow for depth */
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);

  font-size: 1.4rem;

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.08),
      0 4px 6px -2px rgba(0, 0, 0, 0.04);
  }

  ${({ $cssOption }) => {
    if ($cssOption) {
      return generateCSSFromCSSProperties($cssOption);
    }

    if (!$cssOption || ($cssOption && !$cssOption["overflow"])) {
      return "overflow: hidden;";
    }

    return "";
  }};

  /* Mobile: Hidden on mobile (cards shown instead) */
  @media (max-width: 768px) {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow 0.2s ease;
    &:hover {
      box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.05),
        0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
  }
`;

// ─── Common Row Styles ────────────────────────────────────────────────────────

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
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 1024px) {
    column-gap: 1.6rem;
  }
`;

// ─── Enhanced Header with Glassmorphism ───────────────────────────────────────

const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;

  /* Glassmorphism effect */
  background: linear-gradient(
    135deg,
    rgba(244, 244, 245, 0.9) 0%,
    rgba(250, 250, 250, 0.95) 100%
  );
  backdrop-filter: blur(10px);

  border-bottom: 1px solid var(--color-grey-200);
  border-radius: 1.2rem 1.2rem 0 0;

  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--color-grey-700);

  /* Sticky header */
  position: sticky;
  top: -4rem;
  z-index: 10;

  @media (max-width: 1024px) {
    padding: 1.4rem 2rem;
    font-size: 1.1rem;
  }
`;

// ─── Enhanced Row with Hover Effects ──────────────────────────────────────────

const StyledRow = styled(CommonRow)`
  padding: 1.4rem 2.4rem;

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:hover {
    background-color: var(--color-brand-50);
    transform: translateX(4px);
    border-left: 3px solid var(--color-brand-500);
    padding-left: calc(2.4rem - 3px);
  }

  &:active {
    background-color: var(--color-brand-100);
  }

  @media (max-width: 1024px) {
    padding: 1.2rem 2rem;

    &:hover {
      padding-left: calc(2rem - 3px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: background-color 0.2s ease;

    &:hover {
      transform: none;
    }
  }
`;

// ─── Body Container ───────────────────────────────────────────────────────────

const StyledBody = styled.section`
  margin: 0.4rem 0;
`;

// ─── Enhanced Footer ──────────────────────────────────────────────────────────

const Footer = styled.footer`
  background: linear-gradient(
    180deg,
    var(--color-grey-50) 0%,
    var(--color-grey-100) 100%
  );

  display: flex;
  justify-content: center;
  padding: 1.6rem;

  border-top: 1px solid var(--color-grey-200);
  border-radius: 0 0 1.2rem 1.2rem;

  /* Hide footer when empty */
  &:not(:has(*)) {
    display: none;
  }

  @media (max-width: 1024px) {
    padding: 1.2rem;
  }
`;

// ─── Enhanced Empty State ─────────────────────────────────────────────────────

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;

  padding: 6rem 2.4rem;
  text-align: center;

  .empty-icon {
    width: 8rem;
    height: 8rem;

    background: linear-gradient(
      135deg,
      var(--color-grey-100) 0%,
      var(--color-grey-200) 100%
    );

    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 3.6rem;
  }

  .empty-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-grey-800);
    margin: 0;
  }

  .empty-description {
    font-size: 1.5rem;
    color: var(--color-grey-600);
    margin: 0;
    max-width: 40rem;
  }

  @media (max-width: 1024px) {
    padding: 4rem 2rem;

    .empty-icon {
      width: 6rem;
      height: 6rem;
      font-size: 2.8rem;
    }

    .empty-title {
      font-size: 1.8rem;
    }

    .empty-description {
      font-size: 1.4rem;
    }
  }

  @media (max-width: 768px) {
    padding: 3rem 1.6rem;
  }
`;

// ─── Context ──────────────────────────────────────────────────────────────────

const TableContext = createContext<{ columns: string }>({
  columns: "6.4rem 1.8fr 2.2fr 1fr 1fr 1fr",
});

// ─── Main Table Component ─────────────────────────────────────────────────────

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

// ─── Header Component ─────────────────────────────────────────────────────────

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

// ─── Row Component ────────────────────────────────────────────────────────────

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

// ─── Body Component ───────────────────────────────────────────────────────────

const Body = ({
  children,
  isNoData,
}: {
  children: ReactNode;
  isNoData: boolean;
}) => {
  if (isNoData) {
    return (
      <Empty>
        <div className="empty-icon">📋</div>
        <h3 className="empty-title">No data available</h3>
        <p className="empty-description">
          There are currently no tours to display. Create your first tour to get
          started!
        </p>
      </Empty>
    );
  }

  return <StyledBody>{children}</StyledBody>;
};

// ─── Attach Sub-components ────────────────────────────────────────────────────

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;

export default Table;
