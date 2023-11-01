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
import styled, { IStyledComponent } from "styled-components";
import { useOutsideClick } from "src/hooks/useOutsideClick";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button<{
  $icon?: {
    $height: number;
    $width: number;
  } | null;
}>`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    height: ${(props) =>
      props?.$icon?.$height ? `${props.$icon.$height}rem` : "2.4rem"};
    width: ${(props) =>
      props?.$icon?.$width ? `${props?.$icon.$width}rem` : "2.4rem"};

    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul<{
  $position: { x: number | null; y: number | null };
}>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.$position.x}px;
  top: ${(props) => props.$position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.2rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &[name="danger"] {
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--color-red-500);
      color: var(--color-grey-50);

      svg {
        color: var(--color-grey-50);
      }
    }
  }
`;

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
    <StyledToggle $icon={$icon} onClick={handleClick} {...restPropsButton}>
      {children}
    </StyledToggle>
  );
};

const List = ({ id, children }: { id: string; children: ReactNode }) => {
  const { openId, position, close } = useContext(MenusContext);
  const ref = useOutsideClick(close) as MutableRefObject<HTMLUListElement>;

  if (openId !== id) return null;

  return createPortal(
    <StyledList $position={position} ref={ref}>
      {children}
    </StyledList>,
    document.body
  );
};

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
    <li>
      <StyledButton onClick={handleClick} {...restPropsButton}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
};

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
