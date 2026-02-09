import {
  CSSProperties,
  FC,
  MouseEventHandler,
  ReactElement,
  RefObject,
} from "react";

import { ExclamationCircleIcon, PhotoIcon } from "@heroicons/react/24/outline";

import Pagination from "src/components/Molecules/Pagination";
import FormTour from "src/components/Organisms/ComposedAsFeatures/TourListManagement/FormTour";
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
import { useSetViewPosition } from "src/hooks/useSetViewPosition";
import { useUpdateEffect } from "src/hooks/useUpdateEffect";
import { formatRupiah } from "src/utils/Number";

const TableTours: FC<{
  columns: { id: string; label: ReactElement | string }[];
  currentPage: number;
  header?: { cssOption: CSSProperties };
  onDeleteRow: {
    handler: (
      tourId: string,
      tourSlug: string,
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
  resetViewPosition?: {
    behavior: "auto" | "instant" | "smooth";
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
    ref: RefObject<HTMLDivElement>;
  };
  rows: {
    data: ToursCollectionQuery | null;
    isError: boolean;
    isLoading: boolean;
    isSuccess: boolean;
  };
}> = ({
  columns,
  currentPage,
  header,
  onDeleteRow,
  onNavigateToNextPage,
  onNavigateToPreviousPage,
  onSuccessUpdateRow,
  resetViewPosition,
  rows: { data, isError, isLoading, isSuccess },
}) => {
  const setViewPosition = useSetViewPosition();

  useUpdateEffect(() => {
    if (resetViewPosition) {
      setViewPosition({
        behavior: resetViewPosition?.behavior,
        block: resetViewPosition?.block,
        inline: resetViewPosition?.inline,
        ref: resetViewPosition.ref,
      });
    }
  }, [currentPage]);

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
                {data?.toursCollection?.edges?.map((tour) => {
                  const parsedPhotos: { id: string; location: string }[] = (
                    tour.node.photos ?? []
                  )
                    .map((photoString) => {
                      try {
                        return photoString ? JSON.parse(photoString) : null;
                      } catch (e) {
                        return null;
                      }
                    })
                    .filter((p): p is { id: string; location: string } => !!p);

                  return (
                    <TableRow
                      formEdit={
                        <FormTour
                          defaultInputValue={{
                            name: tour.node.name ?? "",
                            slug: tour.node.slug ?? "",
                            availability: tour.node.availability ?? 0,
                            capacity: tour.node.capacity ?? 0,
                            city: tour.node.city ?? "",
                            description: tour.node.description ?? "",
                            price: tour.node.price ?? 0,
                            photos: parsedPhotos,
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
                            tour.node.slug ?? "",
                            parsedPhotos
                          ),
                        isLoading: onDeleteRow.isLoading,
                      }}
                      row={{ cssOption: { overflowX: "hidden" } }}
                    >
                      {parsedPhotos.length > 0 ? (
                        <ImgThumbnail
                          src={`${import.meta.env.VITE_URL_SERVER}/storage/v1/object/public/${
                            parsedPhotos[0].location
                          }`}
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
                  );
                })}
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
