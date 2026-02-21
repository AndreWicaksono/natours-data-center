import {
  CSSProperties,
  FC,
  MouseEventHandler,
  ReactElement,
  RefObject,
  useState,
} from "react";

import { ExclamationCircleIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import styled, { keyframes } from "styled-components";

import Pagination from "src/components/Molecules/Pagination";
import GlassModal from "src/components/Organisms/GlassModal"; // ← New import
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

// ─── Animations ───────────────────────────────────────────────────────────────
// [All your existing animation keyframes stay the same]
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
`;

// ─── All your existing styled components stay exactly the same ───────────────
// [DesktopTableWrapper, MobileCardContainer, MobileCard, etc.]
// I'll include them for completeness but they're unchanged

const DesktopTableWrapper = styled.div`
  display: block;
  animation: ${fadeIn} 0.4s ease-out;
  @media (max-width: 768px) {
    display: none;
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const MobileCardContainer = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    animation: ${fadeIn} 0.4s ease-out;
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const MobileCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  margin-bottom: 1.6rem;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.3s ease-out;

  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-4px);
  }

  @media (max-width: 480px) {
    margin-bottom: 1.2rem;
    border-radius: var(--border-radius-md);
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: box-shadow 0.2s ease;
    &:hover {
      transform: none;
    }
  }
`;

const MobileCardHeader = styled.div`
  display: flex;
  gap: 1.2rem;
  padding: 1.6rem;
  @media (max-width: 480px) {
    padding: 1.4rem;
    gap: 1rem;
  }
`;

const MobileCardThumbnail = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 10rem;
  height: 7.5rem;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: linear-gradient(
    135deg,
    var(--color-grey-100) 0%,
    var(--color-grey-200) 100%
  );
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 480px) {
    width: 8rem;
    height: 6rem;
    border-radius: var(--border-radius-sm);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover img {
      transform: none;
    }
  }
`;

const MobileCardInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-width: 0;
`;

const MobileCardTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-grey-900);
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const MobileCardCity = styled.p`
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--color-grey-600);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  &::before {
    content: "📍";
    font-size: 1.3rem;
  }
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const MobileCardDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  padding: 1.2rem 1.6rem;
  background: linear-gradient(
    180deg,
    var(--color-grey-50) 0%,
    var(--color-grey-0) 100%
  );
  border-top: 1px solid var(--color-grey-100);
  border-bottom: 1px solid var(--color-grey-100);
  @media (max-width: 480px) {
    gap: 0.8rem;
    padding: 1rem 1.4rem;
  }
`;

const MobileCardDetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1rem;
  background: var(--color-grey-0);
  border-radius: var(--border-radius-md);
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-brand-50);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
  }
  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`;

const MobileCardDetailLabel = styled.span`
  font-size: 1.1rem;
  color: var(--color-grey-500);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const MobileCardDetailValue = styled.span`
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--color-grey-900);

  &.price {
    color: var(--color-brand-600);
    font-size: 1.9rem;
  }

  &.availability {
    color: var(--color-brand-500);
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
    &.price {
      font-size: 1.8rem;
    }
  }
`;

const MobileCardActions = styled.div`
  display: flex;
  gap: 0.8rem;
  padding: 1.2rem 1.6rem;
  background: linear-gradient(
    180deg,
    var(--color-grey-0) 0%,
    var(--color-grey-50) 100%
  );
  @media (max-width: 480px) {
    padding: 1rem 1.4rem;
    gap: 0.6rem;
  }
`;

const MobileActionButton = styled.button<{
  $variant?: "primary" | "primary-danger" | "ghost-primary" | "ghost-danger";
}>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.8rem 1.6rem;
  min-height: 3.2rem;
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);

  ${(props) => {
    switch (props.$variant) {
      case "primary-danger":
        return `
          background: var(--color-danger-base);
          border: none;
          color: var(--color-grey-0);

          &:hover:not(:disabled) {
            background: var(--color-danger-dark);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case "ghost-danger":
        return `
          background: transparent;
          color: var(--color-danger-base);
          border: none;

          &:hover:not(:disabled) {
            background: var(--color-danger-base);
            color: var(--color-grey-0);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case "ghost-primary":
        return `
          background: transparent;
          border: none;
          box-shadow: none;
          color: var(--color-brand-500);

          &:hover:not(:disabled) {
            background: var(--color-brand-500);
            color: var(--color-grey-0);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case "primary":
        return `
          background: var(--color-grey-100);
          border: none;
          color: var(--color-grey-700);

          &:hover:not(:disabled) {
            background: var(--color-grey-200);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      default:
        return `
          background: var(--color-brand-500);
          border: none;
          color: var(--color-grey-0);
          
          &:hover:not(:disabled) {
            background: var(--color-brand-600);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }
          
          &:active:not(:disabled) {
            background: var(--color-brand-700);
            transform: translateY(0);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  svg {
    width: 1.8rem;
    height: 1.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.9rem 1.2rem;
    font-size: 1.3rem;
    min-height: 4.2rem;
    svg {
      width: 1.6rem;
      height: 1.6rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      background 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease;
    &:hover:not(:disabled) {
      transform: none;
    }
    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

const SkeletonCard = styled(MobileCard)`
  pointer-events: none;
`;

const SkeletonBlock = styled.div<{ $height?: string; $width?: string }>`
  height: ${(props) => props.$height || "1.6rem"};
  width: ${(props) => props.$width || "100%"};
  background: linear-gradient(
    90deg,
    var(--color-grey-100) 0%,
    var(--color-grey-200) 50%,
    var(--color-grey-100) 100%
  );
  background-size: 200% 100%;
  border-radius: var(--border-radius-md);
  animation: ${shimmer} 1.5s infinite;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const EmptyStateCard = styled.div`
  background: var(--color-grey-0);
  border: 2px dashed var(--color-grey-300);
  border-radius: var(--border-radius-lg);
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
  animation: ${fadeIn} 0.4s ease-out;
  @media (max-width: 480px) {
    padding: 3rem 1.6rem;
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const EmptyStateIcon = styled.div`
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
  svg {
    width: 4rem;
    height: 4rem;
    color: var(--color-grey-400);
  }
  @media (max-width: 480px) {
    width: 6rem;
    height: 6rem;
    svg {
      width: 3rem;
      height: 3rem;
    }
  }
`;

const EmptyStateText = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--color-grey-700);
  margin: 0;
  line-height: 1.5;
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

// ─── NEW: Mobile Tour Card Component with GlassModal ─────────────────────────

interface TourData {
  id: string;
  name?: string | null;
  slug?: string | null;
  availability?: number | null;
  capacity?: number | null;
  city?: string | null;
  description?: string | null;
  price?: number | null;
  is_published?: boolean | null;
}

const MobileTourCard: FC<{
  tour: TourData;
  parsedPhotos: { id: string; location: string }[];
  onDelete: () => void;
  onSuccessUpdate: (
    data: UpdateToursCollectionMutation,
    fieldsChanged: string[]
  ) => void;
  isDeleting: boolean;
}> = ({ tour, parsedPhotos, onDelete, onSuccessUpdate, isDeleting }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <MobileCard>
        <MobileCardHeader>
          <MobileCardThumbnail>
            {parsedPhotos.length > 0 ? (
              <img
                src={`${import.meta.env.VITE_URL_SERVER}/storage/v1/object/public/${
                  parsedPhotos[0].location
                }`}
                alt={tour.name ?? "Tour"}
                loading="lazy"
              />
            ) : (
              <PhotoIcon height={32} width={32} color="var(--color-grey-300)" />
            )}
          </MobileCardThumbnail>

          <MobileCardInfo>
            <MobileCardTitle>{tour.name}</MobileCardTitle>
            <MobileCardCity>{tour.city}</MobileCardCity>
          </MobileCardInfo>
        </MobileCardHeader>

        <MobileCardDetails>
          <MobileCardDetailItem>
            <MobileCardDetailLabel>Price</MobileCardDetailLabel>
            <MobileCardDetailValue className="price">
              {formatRupiah(tour.price ?? 0)}
            </MobileCardDetailValue>
          </MobileCardDetailItem>

          <MobileCardDetailItem>
            <MobileCardDetailLabel>Available</MobileCardDetailLabel>
            <MobileCardDetailValue className="availability">
              {tour.availability}
            </MobileCardDetailValue>
          </MobileCardDetailItem>
        </MobileCardDetails>

        <MobileCardActions>
          <MobileActionButton
            $variant="ghost-primary"
            onClick={() => setIsEditModalOpen(true)}
          >
            <PencilIcon />
            Edit
          </MobileActionButton>

          <MobileActionButton
            $variant="ghost-danger"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isDeleting}
          >
            <TrashIcon />
            {isDeleting ? "Deleting..." : "Delete"}
          </MobileActionButton>
        </MobileCardActions>
      </MobileCard>

      {/* Edit Modal with GlassModal */}
      <GlassModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Tour"
        subtitle={tour.name}
      >
        <FormTour
          defaultInputValue={{
            name: tour.name ?? "",
            slug: tour.slug ?? "",
            availability: tour.availability ?? 0,
            capacity: tour.capacity ?? 0,
            city: tour.city ?? "",
            description: tour.description ?? "",
            price: tour.price ?? 0,
            photos: parsedPhotos,
            publish: tour.is_published ?? false,
          }}
          itemID={tour.id}
          mode="edit"
          onSuccessUpdate={(data, fieldsChanged) => {
            onSuccessUpdate(data, fieldsChanged);
            setIsEditModalOpen(false);
          }}
          type="modal"
        />
      </GlassModal>

      {/* Delete Confirmation Modal */}
      <GlassModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Tour"
        maxHeight="35vh"
      >
        <div style={{ padding: "0 0 2rem 0" }}>
          <p
            style={{
              fontSize: "1.5rem",
              lineHeight: "1.6",
              color: "var(--color-grey-700)",
              marginBottom: "2rem",
            }}
          >
            Are you sure you want to delete <strong>{tour.name}</strong>? This
            action cannot be undone.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1.2rem",
              justifyContent: "flex-end",
            }}
          >
            <MobileActionButton
              $variant="ghost-primary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </MobileActionButton>

            <MobileActionButton
              $variant="ghost-danger"
              onClick={() => {
                onDelete();
                setIsDeleteModalOpen(false);
              }}
              disabled={isDeleting}
            >
              <TrashIcon />
              {isDeleting ? "Deleting..." : "Delete"}
            </MobileActionButton>
          </div>
        </div>
      </GlassModal>
    </>
  );
};

// ─── Main TableTours Component ────────────────────────────────────────────────

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
        {/* Desktop Table View */}
        <DesktopTableWrapper>
          <Table cssOption={{ overflow: "visible" }} role="table">
            <Table.Header cssOption={header?.cssOption}>
              {columns.map((column) => (
                <div key={column.id}>{column.label}</div>
              ))}
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
                    color="var(--color-danger-base)"
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
                      .filter(
                        (p): p is { id: string; location: string } => !!p
                      );

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
                              Are you sure want to delete{" "}
                              <b>{tour.node.name}</b>? This action cannot be
                              undone.
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
                            alt={tour.node.name ?? "Tour"}
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
        </DesktopTableWrapper>

        {/* Mobile Card View with GlassModal */}
        <MobileCardContainer>
          {/* Error State */}
          {isError && !isLoading && (
            <EmptyStateCard>
              <EmptyStateIcon>
                <ExclamationCircleIcon />
              </EmptyStateIcon>
              <EmptyStateText style={{ color: "var(--color-danger-base)" }}>
                Unable to load tours. Please try refreshing.
              </EmptyStateText>
            </EmptyStateCard>
          )}

          {/* Loading Skeletons */}
          {isLoading && (
            <>
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={`skeleton-${i}`}>
                  <MobileCardHeader>
                    <SkeletonBlock $height="7.5rem" $width="10rem" />
                    <MobileCardInfo>
                      <SkeletonBlock $height="2rem" $width="70%" />
                      <SkeletonBlock $height="1.6rem" $width="50%" />
                    </MobileCardInfo>
                  </MobileCardHeader>
                  <MobileCardDetails>
                    <SkeletonBlock $height="6rem" />
                    <SkeletonBlock $height="6rem" />
                  </MobileCardDetails>
                  <MobileCardActions>
                    <SkeletonBlock $height="4.4rem" />
                    <SkeletonBlock $height="4.4rem" />
                  </MobileCardActions>
                </SkeletonCard>
              ))}
            </>
          )}

          {/* Empty State */}
          {isSuccess &&
            !isError &&
            !isLoading &&
            (!data || data.toursCollection?.edges.length === 0) && (
              <EmptyStateCard>
                <EmptyStateIcon>
                  <PhotoIcon />
                </EmptyStateIcon>
                <EmptyStateText>
                  No tours found. Create your first tour to get started!
                </EmptyStateText>
              </EmptyStateCard>
            )}

          {/* Data Cards using GlassModal */}
          {isSuccess &&
            !isError &&
            !isLoading &&
            data?.toursCollection?.edges?.map((tour) => {
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
                <MobileTourCard
                  key={`mobile-card-${tour.node.id}`}
                  tour={tour.node}
                  parsedPhotos={parsedPhotos}
                  onDelete={() =>
                    onDeleteRow.handler(
                      tour.node.id,
                      tour.node.slug ?? "",
                      parsedPhotos
                    )
                  }
                  onSuccessUpdate={onSuccessUpdateRow}
                  isDeleting={onDeleteRow.isLoading}
                />
              );
            })}

          {/* Mobile Pagination */}
          {isSuccess &&
            !isError &&
            !isLoading &&
            data &&
            data.toursCollection &&
            data.toursCollection.edges.length > 0 && (
              <div style={{ marginTop: "2rem" }}>
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
              </div>
            )}
        </MobileCardContainer>
      </LayoutRow>
    </>
  );
};

export default TableTours;
