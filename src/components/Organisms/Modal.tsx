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
import styled, { keyframes } from "styled-components";
import { useOutsideClick } from "src/hooks/useOutsideClick";
import { XMarkIcon } from "@heroicons/react/24/solid";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translate(-50%, -45%); opacity: 0; }
  to   { transform: translate(-50%, -50%); opacity: 1; }
`;

const slideUpMobile = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`;

// ─── Styled Components ────────────────────────────────────────────────────────

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;

  animation: ${slideUp} 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 2.8rem 3.2rem;
    max-height: 92vh;
    max-width: 90vw;
  }

  /* Mobile */
  @media (max-width: 768px) {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    transform: none;

    width: 100%;
    max-width: 100%;
    max-height: 95vh;

    border-radius: 1.6rem 1.6rem 0 0;
    padding: 2.4rem 2rem;

    animation: ${slideUpMobile} 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 2rem 1.6rem;
    max-height: 98vh;
  }

  /* Smooth scrolling */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
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

  animation: ${fadeIn} 0.3s ease-out;

  /* Mobile: Darker overlay */
  @media (max-width: 768px) {
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(6px);
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.6rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  position: absolute;
  top: 1.2rem;
  right: 1.9rem;
  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--color-grey-100);
    transform: translateX(0.8rem) scale(1.1);
  }

  &:active {
    transform: translateX(0.8rem) scale(0.95);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-500);
  }

  /* Mobile: Larger close button for better touch target */
  @media (max-width: 768px) {
    top: 1.6rem;
    right: 1.6rem;
    padding: 0.8rem;
    transform: none;

    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }

    & svg {
      width: 2.8rem;
      height: 2.8rem;
    }
  }

  /* Small: Even larger */
  @media (max-width: 480px) {
    padding: 1rem;

    & svg {
      width: 3.2rem;
      height: 3.2rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: background-color 0.2s ease;
    &:hover {
      transform: none;
    }
    &:active {
      transform: none;
    }

    @media (max-width: 768px) {
      &:hover {
        transform: none;
      }
      &:active {
        transform: none;
      }
    }
  }
`;

export const ContainerModalContentOverflowYScroll = styled.div<{
  $height: number;
}>`
  height: ${({ $height }) => $height}vh;
  overflow-y: auto;
  overflow-x: hidden;

  /* Smooth scrolling */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 0.8rem;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-100);
    border-radius: 1rem;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-400);
    border-radius: 1rem;

    &:hover {
      background: var(--color-grey-500);
    }
  }

  /* Mobile: Adjust height to account for bottom sheet */
  @media (max-width: 768px) {
    height: ${({ $height }) => Math.min($height, 70)}vh;
  }

  @media (max-width: 480px) {
    height: ${({ $height }) => Math.min($height, 65)}vh;
  }
`;

// ─── Context & Types ──────────────────────────────────────────────────────────

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

export type Trigger_CloseModal = () => void;

type TypeArgChildren =
  | DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>
  | ReactElement;

type TypeArgChildrenOfWindow =
  | DetailedReactHTMLElement<
      React.HTMLAttributes<HTMLElement> & { closeModal: Trigger_CloseModal },
      HTMLElement
    >
  | ReactElement;

type TypeArgOpens = SetStateAction<string>;

type TypeFuncArgs = { children: TypeArgChildren; opens: TypeArgOpens };

// ─── Main Component ───────────────────────────────────────────────────────────

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
        <Button onClick={close} aria-label="Close modal">
          <XMarkIcon />
        </Button>

        {cloneElement(children as TypeArgChildrenOfWindow, {
          closeModal: close,
        })}
      </StyledModal>
    </Overlay>,
    document.body
  );
};

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
