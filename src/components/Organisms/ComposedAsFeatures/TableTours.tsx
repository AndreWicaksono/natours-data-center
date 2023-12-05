import { CSSProperties, FC, MouseEventHandler, ReactElement } from "react";

import { ExclamationCircleIcon, PhotoIcon } from "@heroicons/react/24/outline";

import FormTour from "src/components/Molecules/ComposedAsFeatures/FormTour";
import Pagination from "src/components/Molecules/Pagination";
import Table from "src/components/Organisms/Table/Table";
import TableRow, {
  ImgNoThumbnail,
  ImgThumbnail,
  Label,
  LabelDiscount,
  LabelPrice,
  TableRowResponseMessage,
  TableRowsLoading,
} from "src/components/Organisms/Table/TableRow";

import { LayoutRow } from "src/Global/Styles.css";
import {
  ToursCollectionQuery,
  UpdateToursCollectionMutation,
} from "src/gql/graphql";
import { formatRupiah } from "src/utils/Number";

const TableTours: FC<{
  columns: { id: string; label: ReactElement | string }[];
  header?: { cssOption: CSSProperties };
  onDeleteRow: {
    handler: (
      tourId: string,
      tourPhotos: { id: string; location: string }[]
    ) => void;
    isLoading: boolean;
  };
  onNavigateToNextPage?: MouseEventHandler<HTMLButtonElement>;
  onNavigateToPreviousPage?: MouseEventHandler<HTMLButtonElement>;
  onSuccessUpdateRow: (
    data: UpdateToursCollectionMutation,
    fieldsChanged: string[]
  ) => void;
  rows: {
    data: ToursCollectionQuery | null;
    isError: boolean;
    isLoading: boolean;
    isSuccess: boolean;
  };
}> = ({
  columns,
  header,
  onDeleteRow,
  onNavigateToNextPage,
  onNavigateToPreviousPage,
  onSuccessUpdateRow,
  rows: { data, isError, isLoading, isSuccess },
}) => {
  return (
    <>
      <LayoutRow>
        <Table cssOption={{ overflow: "visible" }} role="table">
          <Table.Header cssOption={header?.cssOption}>
            {columns.map((column) => {
              if (typeof column.label === "string")
                return <div key={column.id}>{column.label}</div>;

              return column.label;
            })}
          </Table.Header>

          <Table.Body
            isNoData={
              isSuccess &&
              !isLoading &&
              (!data || data.toursCollection?.edges.length === 0)
            }
          >
            {isError && !isLoading && (
              <TableRowResponseMessage>
                <ExclamationCircleIcon
                  color="var(--color-red-500)"
                  height={24}
                  width={24}
                />

                <span>
                  Unable to load table data. Please try refreshing in a few
                  seconds later.
                </span>
              </TableRowResponseMessage>
            )}

            {isSuccess && !isError && !isLoading && (
              <>
                {data?.toursCollection?.edges?.map((tour) => (
                  <TableRow
                    formEdit={
                      <FormTour
                        defaultInputValue={{
                          name: tour.node.name ?? "",
                          availability: tour.node.availability ?? 0,
                          capacity: tour.node.capacity ?? 0,
                          city: tour.node.city ?? "",
                          description: tour.node.description ?? "",
                          price: tour.node.price ?? 0,
                          photos: tour.node.photos ?? [],
                          publish: tour.node.is_published ?? false,
                        }}
                        itemID={tour.node.id}
                        mode="edit"
                        onSuccessUpdate={onSuccessUpdateRow}
                        type="modal"
                      />
                    }
                    id={`row-tour-${tour.node.name}`}
                    itemID={tour.node.id}
                    key={`row-tour-${tour.node.name}`}
                    onDelete={{
                      elementConfirmDialog: (
                        <p>
                          Are you sure want to delete <b>{tour.node.name}</b>
                        </p>
                      ),
                      handler: () =>
                        onDeleteRow.handler(
                          tour.node.id,
                          tour.node.photos ?? []
                        ),
                      isLoading: onDeleteRow.isLoading,
                    }}
                    row={{ cssOption: { overflowX: "hidden" } }}
                  >
                    {tour.node.photos && tour.node.photos.length > 0 ? (
                      <ImgThumbnail
                        src={
                          `${
                            import.meta.env.VITE_URL_SERVER
                          }/storage/v1/object/public/${
                            tour.node.photos[0].location
                          }` ?? ""
                        }
                      />
                    ) : (
                      <ImgNoThumbnail>
                        <PhotoIcon
                          height={24}
                          width={24}
                          color="var(--color-grey-200)"
                        />
                      </ImgNoThumbnail>
                    )}
                    <Label>{tour.node.name}</Label>
                    <div>{tour.node.city}</div>
                    <LabelPrice>
                      {formatRupiah(tour.node.price ?? 0)}
                    </LabelPrice>
                    <LabelDiscount>{tour.node.availability}</LabelDiscount>
                  </TableRow>
                ))}
              </>
            )}

            {isLoading && TableRowsLoading}
          </Table.Body>

          <Table.Footer>
            <Pagination
              next={{
                disabled: !data?.toursCollection?.pageInfo.hasNextPage,
                onClick: (e) => {
                  if (onNavigateToNextPage) {
                    onNavigateToNextPage(e);
                  }
                },
              }}
              previous={{
                disabled: !data?.toursCollection?.pageInfo.hasPreviousPage,
                onClick: (e) => {
                  if (onNavigateToPreviousPage) {
                    onNavigateToPreviousPage(e);
                  }
                },
              }}
            />
          </Table.Footer>
        </Table>
      </LayoutRow>
    </>
  );
};

export default TableTours;
