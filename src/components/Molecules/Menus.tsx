import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  Dispatch,
  FC,
  HTMLAttributes,
  MouseEvent,
  MutableRefObject,
  ReactElement,
  ReactNode,
  ReactPortal,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styled, { IStyledComponent, keyframes } from "styled-components";
import { useOutsideClick } from "src/hooks/useOutsideClick";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// ─── Menu Container ───────────────────────────────────────────────────────────

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

// ─── Toggle Button ────────────────────────────────────────────────────────────

const StyledToggle = styled.button<{
  $icon?: {
    $height: number;
    $width: number;
  } | null;
}>`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  background: transparent;
  border: none;
  padding: 0.8rem;
  border-radius: 1.2rem;

  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  /* Hover effect */
  &:hover {
    background: var(--color-grey-100);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  /* Focus state */
  &:focus-visible {
    outline: 2px solid var(--color-brand-400);
    outline-offset: 2px;
  }

  & svg {
    height: ${(props) =>
      props?.$icon?.$height ? `${props.$icon.$height}rem` : "2.4rem"};
    width: ${(props) =>
      props?.$icon?.$width ? `${props?.$icon.$width}rem` : "2.4rem"};

    color: var(--color-grey-700);
    transition: color 0.2s ease;
  }

  &:hover svg {
    color: var(--color-grey-900);
  }

  @media (max-width: 767px) {
    padding: 0.6rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      background 0.2s ease,
      color 0.2s ease;

    &:hover,
    &:active {
      transform: none;
    }
  }
`;

// ─── Dropdown List ────────────────────────────────────────────────────────────

const StyledList = styled.ul<{
  $position: { x: number | null; y: number | null };
}>`
  position: fixed;
  z-index: 1000;

  min-width: 20rem;

  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px) saturate(180%);

  border: 1px solid var(--color-grey-200);
  border-radius: 1.2rem;

  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);

  padding: 0.8rem;
  margin: 0;
  list-style: none;

  right: ${(props) => props.$position.x}px;
  top: ${(props) => props.$position.y}px;

  animation: ${fadeIn} 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  /* Divider between menu items */
  & > li:not(:last-child) {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 1.2rem;
      right: 1.2rem;

      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        var(--color-grey-200) 50%,
        transparent 100%
      );
    }
  }

  @media (max-width: 767px) {
    min-width: 18rem;
    padding: 0.6rem;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ─── Menu Button ──────────────────────────────────────────────────────────────

const StyledButton = styled.button`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 1.2rem;

  background: transparent;
  border: none;
  border-radius: 0.8rem;

  padding: 1.2rem 1.6rem;

  font-size: 1.4rem;
  font-weight: 500;
  text-align: left;
  color: var(--color-grey-700);

  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  /* Icon */
  & svg {
    width: 1.8rem;
    height: 1.8rem;
    flex-shrink: 0;

    color: var(--color-grey-500);
    transition: all 0.2s ease;
  }

  /* Text */
  & span {
    flex: 1;
    line-height: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Hover state */
  &:hover {
    background: var(--color-grey-100);
    color: var(--color-grey-900);
    transform: translateX(2px);

    svg {
      color: var(--color-grey-700);
      transform: scale(1.1);
    }
  }

  /* Active state */
  &:active {
    transform: translateX(2px) scale(0.98);
  }

  /* Focus state */
  &:focus-visible {
    outline: 2px solid var(--color-brand-400);
    outline-offset: -2px;
  }

  /* Danger variant */
  &[name="danger"] {
    color: var(--color-danger-base);

    svg {
      color: var(--color-danger-base);
    }

    &:hover {
      background: linear-gradient(
        135deg,
        var(--color-danger-base) 0%,
        var(--color-danger-dark) 100%
      );

      color: white;

      svg {
        color: white;
      }
    }
  }

  /* Success variant */
  &[name="success"] {
    color: var(--color-brand-600);

    svg {
      color: var(--color-brand-600);
    }

    &:hover {
      background: linear-gradient(
        135deg,
        var(--color-brand-400) 0%,
        var(--color-brand-600) 100%
      );

      color: white;

      svg {
        color: white;
      }
    }
  }

  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background: transparent;
      transform: none;
    }
  }

  @media (max-width: 767px) {
    padding: 1.1rem 1.4rem;
    font-size: 1.4rem;

    & svg {
      width: 2rem;
      height: 2rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      background 0.2s ease,
      color 0.2s ease;

    &:hover,
    &:active {
      transform: none;
    }

    &:hover svg {
      transform: none;
    }
  }
`;

// ─── Menu Header (Optional) ───────────────────────────────────────────────────

const MenuHeader = styled.div`
  padding: 1.2rem 1.6rem 0.8rem;
  margin-bottom: 0.4rem;

  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-grey-500);

  border-bottom: 1px solid var(--color-grey-200);

  @media (max-width: 767px) {
    padding: 1rem 1.4rem 0.6rem;
    font-size: 1.1rem;
  }
`;

// ─── Menu Divider ─────────────────────────────────────────────────────────────

const MenuDivider = styled.hr`
  margin: 0.8rem 1.2rem;
  border: none;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--color-grey-300) 50%,
    transparent 100%
  );
`;

// ─── Context & Types ──────────────────────────────────────────────────────────

type TypeMenusContext = {
  close: () => void;
  open: Dispatch<SetStateAction<TypeMenusContext["openId"]>> | null;
  openId: string | null;
  position: { x: number | null; y: number | null };
  setPosition: Dispatch<SetStateAction<TypeMenusContext["position"]>> | null;
};

type TypeProps_Button = {
  icon?: ReactElement;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { $icon?: { $height: number; $width: number } };

const MenusContext = createContext<TypeMenusContext>({
  close: () => null,
  open: null,
  openId: null,
  position: { x: null, y: null },
  setPosition: null,
});

// ─── Main Menus Component ─────────────────────────────────────────────────────

const Menus: FC<{ children: ReactNode }> & {
  Menu: IStyledComponent<
    "web",
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  >;
  Toggle: ({ id, children }: TypeProps_Button) => ReactNode;
  List: ({
    id,
    children,
  }: {
    id: string;
    children: ReactNode;
  }) => ReactPortal | null;
  Button: ({ children, icon, onClick }: TypeProps_Button) => ReactNode;
  Header: typeof MenuHeader;
  Divider: typeof MenuDivider;
} = ({ children }) => {
  const [openId, setOpenId] = useState<TypeMenusContext["openId"]>("");
  const [position, setPosition] = useState<TypeMenusContext["position"]>({
    x: null,
    y: null,
  });

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
};

// ─── Toggle Component ─────────────────────────────────────────────────────────

const Toggle = ({
  id,
  children,
  $icon = { $height: 2.4, $width: 2.4 },
  ...restPropsButton
}: TypeProps_Button) => {
  const { openId, close, open, setPosition } = useContext(MenusContext);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();

    const rect = (e.target as HTMLButtonElement)
      ?.closest("button")
      ?.getBoundingClientRect();

    if (setPosition && open && rect) {
      setPosition({
        x: window.innerWidth - rect.width - rect.x,
        y: rect.y + rect.height + 8,
      });

      openId === "" || openId !== id ? open(id as string) : close();
    }
  };

  return (
    <StyledToggle
      $icon={$icon}
      onClick={handleClick}
      aria-expanded={openId === id}
      aria-haspopup="true"
      {...restPropsButton}
    >
      {children}
    </StyledToggle>
  );
};

// ─── List Component ───────────────────────────────────────────────────────────

const List = ({ id, children }: { id: string; children: ReactNode }) => {
  const { openId, position, close } = useContext(MenusContext);
  const ref = useOutsideClick(
    close,
    false
  ) as MutableRefObject<HTMLUListElement>;

  if (openId !== id) return null;

  return createPortal(
    <StyledList
      $position={position}
      ref={ref}
      role="menu"
      aria-orientation="vertical"
    >
      {children}
    </StyledList>,
    document.body
  );
};

// ─── Button Component ─────────────────────────────────────────────────────────

const Button = ({
  children,
  icon,
  onClick,
  ...restPropsButton
}: TypeProps_Button) => {
  const { close } = useContext(MenusContext);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    onClick?.(e);
    close();
  }

  return (
    <li role="none">
      <StyledButton onClick={handleClick} role="menuitem" {...restPropsButton}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
};

// ─── Attach Components ────────────────────────────────────────────────────────

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;
Menus.Header = MenuHeader;
Menus.Divider = MenuDivider;

export default Menus;
