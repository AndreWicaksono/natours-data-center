import {
  DetailedReactHTMLElement,
  Dispatch,
  FC,
  MutableRefObject,
  ReactElement,
  ReactNode,
  SetStateAction,
  cloneElement,
  createContext,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { useOutsideClick } from "src/hooks/useOutsideClick";
import { XMarkIcon } from "@heroicons/react/24/solid";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-500);
  }
`;

type TypeModalContext = {
  open: Dispatch<SetStateAction<string>> | null;
  openName: string | null;
  close: () => void;
};

const ModalContext = createContext<TypeModalContext>({
  open: null,
  openName: "",
  close: () => null,
});

const Modal: FC<{ children: ReactNode }> & {
  Open: ({ children, opens }: TypeFuncArgs) => TypeArgChildren;
  Window: ({
    children,
    name,
  }: {
    children: TypeArgChildrenOfWindow;
    name: string;
  }) => React.ReactPortal | null;
} = ({ children }) => {
  const [openName, setOpenName] = useState<string>("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
};

type TypeOnCloseModal = () => void;
type TypeArgChildren =
  | DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>
  | ReactElement;
type TypeArgChildrenOfWindow =
  | DetailedReactHTMLElement<
      React.HTMLAttributes<HTMLElement> & { onCloseModal: TypeOnCloseModal },
      HTMLElement
    >
  | ReactElement;
type TypeArgOpens = SetStateAction<string>;

type TypeFuncArgs = { children: TypeArgChildren; opens: TypeArgOpens };

const Open = ({
  children,
  opens: opensWindowName,
}: TypeFuncArgs): TypeArgChildren => {
  const { open } = useContext(ModalContext);

  return cloneElement(children, {
    onClick: () => open && open(opensWindowName),
  });
};

const Window = ({
  children,
  name,
}: {
  children: TypeArgChildrenOfWindow;
  name: string;
}) => {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close) as MutableRefObject<HTMLDivElement>;

  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <XMarkIcon />
        </Button>

        <div>{cloneElement(children, { ...children.props })}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
};

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
