import {
  FC,
  HTMLAttributes,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from "react";

import styled from "styled-components";

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

export const DeleteConfirmationBoxStyled = styled.div`
  margin: 1.6rem -1rem 0rem -2rem;

  p {
    padding-bottom: 2rem;
  }

  section {
    display: flex;
    gap: 1.6rem;
    justify-content: flex-end;
  }
`;

export const ImgThumbnail = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

export const ImgNoThumbnail = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 6.4rem;

  aspect-ratio: 3 / 2;
  background-color: var(--color-zinc-100);
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

export const Label = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
`;

export const LabelPrice = styled.div`
  font-weight: 600;
`;

export const LabelDiscount = styled.div`
  font-weight: 500;
  color: var(--color-green-700);
`;

export const TableRowResponseMessage = styled.div`
  display: flex;
  justify-content: center;
  font-size: 1.6rem;
  padding: 2.4rem;

  svg {
    margin-right: 0.4rem;
  }
`;

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
          $size="small"
          $variation="secondary"
          disabled={onDelete.isLoading}
          onClick={() => closeModal?.()}
        >
          Cancel
        </Button>

        <Button
          $flex={{ alignItems: "center", gap: "0.4rem" }}
          $size="medium"
          $variation="danger"
          disabled={onDelete.isLoading}
          onClick={(e) => onDelete.handler(e)}
        >
          {onDelete.isLoading ? (
            <SpinnerMini />
          ) : (
            <TrashIcon height={16} width={16} />
          )}
          <span>Delete</span>
        </Button>
      </section>
    </DeleteConfirmationBoxStyled>
  );
};

export const TableRow: FC<
  {
    children: ReactNode[];
    disableRowMenuActions?: boolean;
    formEdit?: ReactElement;
    id: string;
    onDelete?: {
      elementConfirmDialog: ReactElement;
      handler: MouseEventHandler<HTMLButtonElement>;
      isLoading: boolean;
    };
    onDuplicate?: MouseEventHandler<HTMLButtonElement>;
  } & HTMLAttributes<HTMLDivElement>
> = ({
  children,
  disableRowMenuActions = false,
  formEdit,
  id,
  onDelete,
  onDuplicate,
}) => {
  return (
    <Table.Row>
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
                        icon={<DocumentDuplicateIcon height={16} width={16} />}
                        onClick={(e) => onDuplicate(e)}
                        disabled={false}
                      >
                        <span>Duplicate</span>
                      </Menus.Button>
                    )}

                    {formEdit && (
                      <Modal.Open opens="edit">
                        <Menus.Button
                          icon={<PencilSquareIcon height={16} width={16} />}
                          onClick={() => null}
                        >
                          Edit
                        </Menus.Button>
                      </Modal.Open>
                    )}

                    {onDelete && (
                      <Modal.Open opens="delete">
                        <Menus.Button
                          icon={<TrashIcon height={16} width={16} />}
                          name="danger"
                        >
                          Delete
                        </Menus.Button>
                      </Modal.Open>
                    )}
                  </div>
                </Menus.List>

                {formEdit && (
                  <Modal.Window name="edit">{formEdit}</Modal.Window>
                )}

                {onDelete && (
                  <Modal.Window name="delete">
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

export const TableRowsLoading: ReactNode = (
  <>
    <TableRow disableRowMenuActions={true} id="loading">
      <LoadingBar
        $height="100%"
        $width="6.4rem"
        style={{
          aspectRatio: "3/2",
          objectFit: "cover",
          transform: "scale(1.5) translateX(-7px)",
        }}
      />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
    </TableRow>

    <TableRow disableRowMenuActions={true} id="loading">
      <LoadingBar
        $height="100%"
        $width="6.4rem"
        style={{
          aspectRatio: "3/2",
          objectFit: "cover",
          transform: "scale(1.5) translateX(-7px)",
        }}
      />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
    </TableRow>

    <TableRow disableRowMenuActions={true} id="loading">
      <LoadingBar
        $height="100%"
        $width="6.4rem"
        style={{
          aspectRatio: "3/2",
          objectFit: "cover",
          transform: "scale(1.5) translateX(-7px)",
        }}
      />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
    </TableRow>

    <TableRow disableRowMenuActions={true} id="loading">
      <LoadingBar
        $height="100%"
        $width="6.4rem"
        style={{
          aspectRatio: "3/2",
          objectFit: "cover",
          transform: "scale(1.5) translateX(-7px)",
        }}
      />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
    </TableRow>

    <TableRow disableRowMenuActions={true} id="loading">
      <LoadingBar
        $height="100%"
        $width="6.4rem"
        style={{
          aspectRatio: "3/2",
          objectFit: "cover",
          transform: "scale(1.5) translateX(-7px)",
        }}
      />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
    </TableRow>
    <TableRow disableRowMenuActions={true} id="loading">
      <LoadingBar
        $height="100%"
        $width="6.4rem"
        style={{
          aspectRatio: "3/2",
          objectFit: "cover",
          transform: "scale(1.5) translateX(-7px)",
        }}
      />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
    </TableRow>
    <TableRow disableRowMenuActions={true} id="loading">
      <LoadingBar
        $height="100%"
        $width="6.4rem"
        style={{
          aspectRatio: "3/2",
          objectFit: "cover",
          transform: "scale(1.5) translateX(-7px)",
        }}
      />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
    </TableRow>
    <TableRow disableRowMenuActions={true} id="loading">
      <LoadingBar
        $height="100%"
        $width="6.4rem"
        style={{
          aspectRatio: "3/2",
          objectFit: "cover",
          transform: "scale(1.5) translateX(-7px)",
        }}
      />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
    </TableRow>
    <TableRow disableRowMenuActions={true} id="loading">
      <LoadingBar
        $height="100%"
        $width="6.4rem"
        style={{
          aspectRatio: "3/2",
          objectFit: "cover",
          transform: "scale(1.5) translateX(-7px)",
        }}
      />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
    </TableRow>
    <TableRow disableRowMenuActions={true} id="loading">
      <LoadingBar
        $height="100%"
        $width="6.4rem"
        style={{
          aspectRatio: "3/2",
          objectFit: "cover",
          transform: "scale(1.5) translateX(-7px)",
        }}
      />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
      <LoadingBar $borderRadius=".4rem" />
    </TableRow>
  </>
);

export default TableRow;
