import {
  CSSProperties,
  FC,
  HTMLAttributes,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from "react";
import styled, { keyframes } from "styled-components";

import {
  DocumentDuplicateIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

import Button from "src/components/Atoms/Button";
import { LoadingBar } from "src/components/Atoms/LoadingBar";
import SpinnerMini from "src/components/Atoms/SpinnerMini";
import Menus from "src/components/Molecules/Menus";
import Modal, { Trigger_CloseModal } from "src/components/Organisms/Modal";
import Table from "src/components/Organisms/Table/Table";

// ─── Animations ───────────────────────────────────────────────────────────────

const shimmer = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ─── Enhanced Delete Confirmation Box ────────────────────────────────────────

export const DeleteConfirmationBoxStyled = styled.div`
  margin: 1.6rem -1rem 0rem -2rem;
  animation: ${fadeIn} 0.3s ease-out;

  p {
    padding-bottom: 2rem;
    font-size: 1.5rem;
    line-height: 1.6;
    color: var(--color-grey-700);
  }

  section {
    display: flex;
    gap: 1.2rem;
    justify-content: flex-end;

    @media (max-width: 768px) {
      flex-direction: column-reverse;
      gap: 1rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ─── Enhanced Image Components ────────────────────────────────────────────────

export const ImgThumbnail = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);

  border-radius: 0.6rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: scale(1.6) translateX(-7px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow 0.2s ease;
    &:hover {
      transform: scale(1.5) translateX(-7px);
    }
  }
`;

export const ImgNoThumbnail = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 6.4rem;
  aspect-ratio: 3 / 2;

  background: linear-gradient(
    135deg,
    var(--color-grey-100) 0%,
    var(--color-grey-200) 100%
  );

  border-radius: 0.6rem;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);

  svg {
    opacity: 0.4;
  }

  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(
      135deg,
      var(--color-grey-200) 0%,
      var(--color-grey-300) 100%
    );
  }
`;

// ─── Enhanced Labels ──────────────────────────────────────────────────────────

export const Label = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-grey-800);
  line-height: 1.4;

  transition: color 0.2s ease;

  /* Truncate long text */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const LabelPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-brand-600);

  transition: all 0.2s ease;

  &:hover {
    color: var(--color-brand-700);
    transform: scale(1.05);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`;

export const LabelDiscount = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-green-700);

  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  padding: 0.3rem 0.8rem;
  background: var(--color-green-100);
  border-radius: 2rem;

  transition: all 0.2s ease;

  &:hover {
    background: var(--color-green-200);
    transform: translateY(-2px);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`;

// ─── Enhanced Response Message ────────────────────────────────────────────────

export const TableRowResponseMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  padding: 4rem 2.4rem;
  font-size: 1.6rem;
  color: var(--color-grey-700);

  animation: ${fadeIn} 0.4s ease-out;

  svg {
    flex-shrink: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ─── Enhanced Loading Bar ─────────────────────────────────────────────────────

const EnhancedLoadingBar = styled(LoadingBar)`
  background: linear-gradient(
    90deg,
    var(--color-grey-100) 0%,
    var(--color-grey-200) 50%,
    var(--color-grey-100) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ─── Delete Confirmation Component ───────────────────────────────────────────

const DeleteConfirmationBox: FC<{
  closeModal?: Trigger_CloseModal;
  onDelete: {
    elementConfirmDialog: ReactElement;
    handler: MouseEventHandler<HTMLButtonElement>;
    isLoading: boolean;
  };
}> = ({ closeModal, onDelete }) => {
  return (
    <DeleteConfirmationBoxStyled>
      {onDelete.elementConfirmDialog}

      <section>
        <Button
          $size="medium"
          $variation="secondary"
          disabled={onDelete.isLoading}
          onClick={() => closeModal?.()}
        >
          Cancel
        </Button>

        <Button
          $flex={{ alignItems: "center", gap: "0.6rem" }}
          $size="medium"
          $variation="danger"
          disabled={onDelete.isLoading}
          onClick={(e) => onDelete.handler(e)}
        >
          {onDelete.isLoading ? (
            <>
              <SpinnerMini height="1.6rem" width="1.6rem" />
              <span>Deleting...</span>
            </>
          ) : (
            <>
              <TrashIcon height={18} width={18} />
              <span>Delete</span>
            </>
          )}
        </Button>
      </section>
    </DeleteConfirmationBoxStyled>
  );
};

// ─── Main TableRow Component ──────────────────────────────────────────────────

export const TableRow: FC<
  {
    children: ReactNode[];
    disableRowMenuActions?: boolean;
    formEdit?: ReactElement;
    id: string;
    itemID?: string;
    onDelete?: {
      elementConfirmDialog: ReactElement;
      handler: MouseEventHandler<HTMLButtonElement>;
      isLoading: boolean;
    };
    onDuplicate?: MouseEventHandler<HTMLButtonElement>;
    row?: {
      cssOption?: CSSProperties;
    };
  } & HTMLAttributes<HTMLDivElement>
> = ({
  children,
  disableRowMenuActions = false,
  formEdit,
  id,
  itemID,
  onDelete,
  onDuplicate,
  row,
}) => {
  return (
    <Table.Row cssOption={row?.cssOption}>
      {children}

      {!disableRowMenuActions && (
        <div>
          <Modal>
            <Menus>
              <Menus.Menu>
                <Menus.Toggle id={id} type="button">
                  <EllipsisVerticalIcon />
                </Menus.Toggle>

                <Menus.List id={id}>
                  <div>
                    {onDuplicate && (
                      <Menus.Button
                        icon={<DocumentDuplicateIcon height={18} width={18} />}
                        onClick={(e) => onDuplicate(e)}
                        disabled={false}
                      >
                        <span>Duplicate</span>
                      </Menus.Button>
                    )}

                    {formEdit && (
                      <Modal.Open opens={`edit-${itemID || id}`}>
                        <Menus.Button
                          icon={<PencilSquareIcon height={18} width={18} />}
                          onClick={() => null}
                        >
                          Edit
                        </Menus.Button>
                      </Modal.Open>
                    )}

                    {onDelete && (
                      <Modal.Open opens={`delete-${itemID || id}`}>
                        <Menus.Button
                          icon={<TrashIcon height={18} width={18} />}
                          name="danger"
                        >
                          Delete
                        </Menus.Button>
                      </Modal.Open>
                    )}
                  </div>
                </Menus.List>

                {formEdit && (
                  <Modal.Window name={`edit-${itemID || id}`}>
                    {formEdit}
                  </Modal.Window>
                )}

                {onDelete && (
                  <Modal.Window name={`delete-${itemID || id}`}>
                    <DeleteConfirmationBox onDelete={onDelete} />
                  </Modal.Window>
                )}
              </Menus.Menu>
            </Menus>
          </Modal>
        </div>
      )}
    </Table.Row>
  );
};

// ─── Enhanced Loading State ───────────────────────────────────────────────────

export const TableRowsLoading: ReactNode = (
  <>
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
      <TableRow
        disableRowMenuActions={true}
        id={`loading-${i}`}
        key={`loading-${i}`}
      >
        <EnhancedLoadingBar
          $height="100%"
          $width="6.4rem"
          style={{
            aspectRatio: "3/2",
            objectFit: "cover",
            transform: "scale(1.5) translateX(-7px)",
            borderRadius: "0.6rem",
          }}
        />
        <EnhancedLoadingBar $borderRadius="0.6rem" />
        <EnhancedLoadingBar $borderRadius="0.6rem" />
        <EnhancedLoadingBar $borderRadius="0.6rem" />
        <EnhancedLoadingBar $borderRadius="0.6rem" />
      </TableRow>
    ))}
  </>
);

export default TableRow;
