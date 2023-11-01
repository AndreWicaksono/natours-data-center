import { FC, ReactNode } from "react";

import styled from "styled-components";

import {
  DocumentDuplicateIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

import FormTour from "src/components/Molecules/ComposedAsFeatures/FormTour";
import Menus from "src/components/Molecules/Menus";
import Modal from "src/components/Organisms/Modal";
import Table from "src/components/Organisms/Table/Table";

export const ImgThumbnail = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
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

export const TableRow: FC<{
  idRow: string;
  children: ReactNode[];
}> = ({ children, idRow }) => {
  function handleDuplicate() {}

  return (
    <Table.Row>
      {children}

      <div>
        <Modal>
          <Menus>
            <Menus.Menu>
              <Menus.Toggle id={idRow} type="button">
                <EllipsisVerticalIcon />
              </Menus.Toggle>

              <Menus.List id={idRow}>
                <div>
                  <Menus.Button
                    icon={<DocumentDuplicateIcon height={16} width={16} />}
                    onClick={handleDuplicate}
                    disabled={false}
                  >
                    <span>Duplicate</span>
                  </Menus.Button>

                  <Modal.Open opens="edit">
                    <Menus.Button
                      icon={<PencilSquareIcon height={16} width={16} />}
                      onClick={() => null}
                    >
                      Edit
                    </Menus.Button>
                  </Modal.Open>

                  <Modal.Open opens="delete">
                    <Menus.Button
                      icon={<TrashIcon height={16} width={16} />}
                      name="danger"
                      onClick={() => null}
                    >
                      Delete
                    </Menus.Button>
                  </Modal.Open>
                </div>
              </Menus.List>

              <Modal.Window name="edit">
                <FormTour type="modal" />
              </Modal.Window>

              <Modal.Window name="delete">
                <div />
              </Modal.Window>
            </Menus.Menu>
          </Menus>
        </Modal>
      </div>
    </Table.Row>
  );
};

export default TableRow;
