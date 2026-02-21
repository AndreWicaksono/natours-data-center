import {
  Dispatch,
  FC,
  RefObject,
  SetStateAction,
  useRef,
  useEffect,
  useState,
} from "react";

import { PlusIcon } from "@heroicons/react/20/solid";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSearch, useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import styled from "styled-components";

import Button from "src/components/Atoms/Button";
import Heading from "src/components/Atoms/Heading";
import FormTour from "src/components/Organisms/ComposedAsFeatures/TourListManagement/FormTour";
import TableToursDataViewOperations from "src/components/Molecules/ComposedAsFeatures/TourListManagement/TableToursDataViewOperations";
import TableTours from "src/components/Organisms/ComposedAsFeatures/TourListManagement/TableTours";
import Modal from "src/components/Organisms/Modal";

import { requestDeleteTour } from "src/API/GraphQL/Mutation/ToursCollection";
import { requestToursCollection } from "src/API/GraphQL/Query/ToursCollection";
import { requestPhotoDelete } from "src/API/REST/POST/Storage";
import { cookieKey } from "src/Global/Constants";
import { LayoutRow } from "src/Global/Styles.css";
import {
  OrderByDirection,
  Query,
  ToursCollectionQuery,
  ToursEdge,
  ToursFilter,
  ToursOrderBy,
  UpdateToursCollectionMutation,
} from "src/gql/graphql";
import useClientCookie from "src/hooks/useClientCookie";
import { useSmoothScrollIntoViewBehavior } from "src/hooks/useSmoothScrollIntoViewBehavior";
import { arraySliceIntoChunks } from "src/utils/Array";
import { clearGraphQLPaginationObjectKeys } from "src/utils/Object";

// ─── Mobile-Specific Styles ───────────────────────────────────────────────────

const PageHeader = styled(LayoutRow)`
  /* Override default LayoutRow behavior for better mobile UX */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch !important;
    gap: 1.6rem;
  }

  @media (max-width: 480px) {
    gap: 1.4rem;
  }
`;

const DesktopCreateButton = styled.div`
  display: block;

  @media (max-width: 768px) {
    display: none;
  }
`;

const FloatingCreateButton = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    bottom: 2.4rem;
    right: 2.4rem;
    z-index: 999;

    button {
      width: 5.6rem;
      height: 5.6rem;
      border-radius: 50%;
      padding: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);

      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover:not(:disabled) {
        transform: scale(1.1);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
      }

      &:active:not(:disabled) {
        transform: scale(0.95);
      }

      svg {
        width: 2.4rem;
        height: 2.4rem;
      }

      span {
        display: none;
      }
    }
  }

  @media (max-width: 480px) {
    bottom: 2rem;
    right: 2rem;

    button {
      width: 5.2rem;
      height: 5.2rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    button {
      transition: box-shadow 0.2s ease;

      &:hover:not(:disabled) {
        transform: none;
      }

      &:active:not(:disabled) {
        transform: none;
      }
    }
  }
`;

// ─── Type Definitions ─────────────────────────────────────────────────────────

type Tours_QueryVariables_State_Object = {
  filter?: ToursFilter;
  orderBy?: ToursOrderBy;
  first?: number;
  last?: number;
  after?: string;
  before?: string;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const TemplatePageTours: FC = () => {
  const searchParams = useSearch({ strict: false });
  const searchQuery = (searchParams as { search?: string }).search;
  const [page, setPage] = useState<number>(1);
  const [queryVariables, setQueryVariables] =
    useState<Tours_QueryVariables_State_Object>({
      orderBy: { created_at: OrderByDirection.DescNullsLast },
      first: 10,
    });

  const queryKeyDependencies: {
    filter: Tours_QueryVariables_State_Object["filter"];
    orderBy: Tours_QueryVariables_State_Object["orderBy"];
    page: number;
  } = {
    filter: queryVariables.filter,
    orderBy: queryVariables.orderBy,
    page,
  };

  const refResetViewPosition: RefObject<HTMLDivElement> = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    setPage(1);
    setQueryVariables((prev) => {
      const newVars = { ...prev };
      clearGraphQLPaginationObjectKeys(newVars);
      newVars.first = 10;

      const publishedFilter =
        prev.filter?.is_published !== undefined
          ? { is_published: prev.filter.is_published }
          : {};

      if (searchQuery) {
        newVars.filter = {
          ...publishedFilter,
          or: [
            { name: { ilike: `%${searchQuery}%` } },
            { city: { ilike: `%${searchQuery}%` } },
          ],
        };
      } else {
        newVars.filter =
          Object.keys(publishedFilter).length > 0 ? publishedFilter : undefined;
      }
      return newVars;
    });
  }, [searchQuery]);
  const { getCookie } = useClientCookie();

  const { isPending: isPendingOnDeleteTour, mutate: mutateDeleteTour } =
    useMutation({
      gcTime: 0,
      mutationFn: async ({
        id,
        photos,
        slug,
        token,
      }: {
        id: string;
        photos: { id: string; location: string }[];
        slug: string;
        token: string;
      }) => {
        if (photos.length > 0) {
          await Promise.all(
            photos.map(async (photo) => {
              return await requestPhotoDelete({
                bucket: "tours",
                filename: photo.location.split("/")[1],
                token: getCookie(cookieKey) ?? "",
              });
            })
          );
        }

        if (slug) {
          await queryClient.removeQueries({
            queryKey: [
              "toursBySlug",
              {
                slug,
              },
            ],
          });
        }

        return await requestDeleteTour({
          payload: { atMost: 1, filter: { id } },
          token,
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tours"] });
      },
    });

  const { data, isError, isLoading, isSuccess } = useQuery({
    gcTime: 60 * 60 * 1000,
    queryFn: async () =>
      await requestToursCollection(queryVariables, getCookie(cookieKey) ?? ""),
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["tours", queryKeyDependencies],
    staleTime: 60 * 60 * 1000,
  });

  const queryClient = useQueryClient();
  const resetViewPositionBehavior = useSmoothScrollIntoViewBehavior();

  const {
    handleCacheUpdateOnSuccessCreateTour,
    handleCacheUpdateOnSuccessUpdateTour,
  } = useTourMutationCacheHandler();

  const handleClearSearch = () => {
    navigate({ to: "/tours" });
  };

  return (
    <>
      <PageHeader $type="horizontal" ref={refResetViewPosition}>
        {/* Desktop: Side-by-side layout */}
        {searchQuery ? (
          <LayoutRow
            $type="horizontal"
            style={{
              gap: "1.6rem",
              alignItems: "start",
              flexDirection: searchQuery ? "column" : "row",
            }}
          >
            <Heading as="h1">Search results for: "{searchQuery}"</Heading>
            <Button
              $size="small"
              $variation="secondary"
              onClick={handleClearSearch}
            >
              Clear
            </Button>
          </LayoutRow>
        ) : (
          <Heading as="h1">All tours</Heading>
        )}

        <TableToursDataViewOperations
          onButtonSelectionSelect={(value) => {
            setPage(1);
            setQueryVariables((prevState) => {
              const newState = { ...prevState };
              clearGraphQLPaginationObjectKeys(newState);

              const searchFilter = newState.filter?.or
                ? { or: newState.filter.or }
                : {};

              if (value === "all") {
                newState.filter =
                  Object.keys(searchFilter).length > 0
                    ? searchFilter
                    : undefined;
              } else {
                newState.filter = {
                  ...searchFilter,
                  is_published: { eq: value === "published" },
                };
              }
              newState.first = 10;
              return newState;
            });
          }}
          onDropdownSelectChange={(e) => {
            const orderBy = e.target.value.split("-")[0];
            const orderDirection = e.target.value.split("-")[1];

            setPage(1);
            setQueryVariables((prevState) => {
              const newState = { ...prevState };

              clearGraphQLPaginationObjectKeys(newState);

              return {
                ...newState,
                first: 10,
                orderBy: {
                  [orderBy]: orderDirection,
                },
              };
            });
          }}
          queryVariables={queryVariables}
        />
      </PageHeader>

      <LayoutRow $type="vertical">
        <div>
          {/* Desktop Create Button - in table header */}
          <DesktopCreateButton>
            <Modal key="column-tour-photo">
              <Modal.Open opens="tour-add-form">
                <Button
                  $flex={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  $size="small"
                  disabled={isLoading}
                >
                  <PlusIcon height={16} width={16} />
                  <span>Create a new tour</span>
                </Button>
              </Modal.Open>

              <Modal.Window name="tour-add-form">
                <FormTour
                  mode="add"
                  onSuccessCreate={(data) =>
                    handleCacheUpdateOnSuccessCreateTour(
                      data,
                      () => setPage(1),
                      {
                        setState: setQueryVariables,
                        state: queryVariables,
                      }
                    )
                  }
                  type="modal"
                />
              </Modal.Window>
            </Modal>
          </DesktopCreateButton>
        </div>

        <TableTours
          columns={[
            {
              id: "column-tour-photo",
              label: <>&nbsp;</>,
            },
            { id: "column-tour-name", label: "Tour" },
            { id: "column-tour-city", label: "City" },
            { id: "column-tour-price", label: "Price" },
            { id: "column-tour-availability", label: "Availability" },
            { id: "column-tour-row-navigation", label: "" },
          ]}
          currentPage={page}
          header={{
            cssOption: { position: "sticky", top: "-4.1rem", zIndex: 1 },
          }}
          onDeleteRow={{
            handler: (tourId, tourSlug, tourPhotos) => {
              mutateDeleteTour({
                id: tourId,
                photos: tourPhotos,
                slug: tourSlug,
                token: getCookie(cookieKey) ?? "",
              });
            },
            isLoading: isPendingOnDeleteTour,
          }}
          onNavigateToNextPage={() => {
            setQueryVariables((prevState) => {
              const newState = { ...prevState };

              if ("last" in newState) delete newState.last;
              if ("before" in newState) delete newState.before;

              return {
                ...newState,
                first: 10,
                after: data?.toursCollection?.pageInfo.endCursor ?? "",
              };
            });

            setPage((prevState) => prevState + 1);
          }}
          onNavigateToPreviousPage={() => {
            setQueryVariables((prevState) => {
              const newState = { ...prevState };

              if (queryKeyDependencies.page === 2) {
                clearGraphQLPaginationObjectKeys(newState);

                return { ...newState, first: 10 };
              }

              if ("first" in newState) delete newState.first;
              if ("after" in newState) delete newState.after;

              return {
                ...newState,
                last: 10,
                before: data?.toursCollection?.pageInfo.startCursor ?? "",
              };
            });

            setPage((prevState) => prevState - 1);
          }}
          onSuccessUpdateRow={(data, fieldsChanged) =>
            handleCacheUpdateOnSuccessUpdateTour(data, fieldsChanged)
          }
          resetViewPosition={{
            behavior: resetViewPositionBehavior,
            block: "center",
            ref: refResetViewPosition,
          }}
          rows={{ data: data ?? null, isError, isLoading, isSuccess }}
        />
      </LayoutRow>

      {/* Mobile: Floating Action Button */}
      <FloatingCreateButton>
        <Modal>
          <Modal.Open opens="tour-add-form-mobile">
            <Button
              $flex={{ alignItems: "center", justifyContent: "center" }}
              disabled={isLoading}
              aria-label="Create new tour"
            >
              <PlusIcon />
              <span>Create</span>
            </Button>
          </Modal.Open>

          <Modal.Window name="tour-add-form-mobile">
            <FormTour
              mode="add"
              onSuccessCreate={(data) =>
                handleCacheUpdateOnSuccessCreateTour(data, () => setPage(1), {
                  setState: setQueryVariables,
                  state: queryVariables,
                })
              }
              type="modal"
            />
          </Modal.Window>
        </Modal>
      </FloatingCreateButton>
    </>
  );
};

// ─── Cache Handler Hook ───────────────────────────────────────────────────────

const useTourMutationCacheHandler = (): {
  handleCacheUpdateOnSuccessCreateTour: (
    data: Query,
    onBeforeResetQueryVariables: () => void,
    queryVariables: {
      setState: Dispatch<SetStateAction<Tours_QueryVariables_State_Object>>;
      state: Tours_QueryVariables_State_Object;
    }
  ) => void;
  handleCacheUpdateOnSuccessUpdateTour: (
    data: UpdateToursCollectionMutation,
    fieldsChanged: string[]
  ) => void;
} => {
  const queryClient = useQueryClient();

  const handleCacheUpdateOnSuccessCreateTour = (
    data: Query,
    onBeforeResetQueryVariables: () => void,
    queryVariables: {
      setState: Dispatch<SetStateAction<Tours_QueryVariables_State_Object>>;
      state: Tours_QueryVariables_State_Object;
    }
  ) => {
    if (
      !queryVariables.state.orderBy?.created_at ||
      queryVariables.state.orderBy?.created_at !==
        OrderByDirection.DescNullsLast ||
      queryVariables.state.filter
    ) {
      onBeforeResetQueryVariables();
      queryVariables.setState({
        orderBy: { created_at: OrderByDirection.DescNullsLast },
        first: 10,
      });
    }

    queryClient.invalidateQueries({
      predicate: (query) => {
        return (
          "created_at" in
            (
              (query.queryKey as QueryKey)[1] as {
                [key: string]: object;
              }
            )["orderBy"] ===
          false
        );
      },
      queryKey: ["tours"],
    });

    const queryData = queryClient.getQueriesData<Query>({
      queryKey: ["tours"],
      predicate: (query) => {
        return (
          "created_at" in
          (
            (query.queryKey as QueryKey)[1] as {
              [key: string]: object;
            }
          )["orderBy"]
        );
      },
    });

    const isAllPagesFetched: boolean =
      typeof queryData[queryData.length - 1][1]?.toursCollection?.pageInfo
        .hasNextPage !== "undefined"
        ? !queryData[queryData.length - 1][1]?.toursCollection?.pageInfo
            .hasNextPage
        : true;

    const mergedOldEdges: Array<ToursEdge> = [
      ...(data?.toursCollection?.edges ?? []),
      ...queryData
        .map((item) => item?.[1]?.toursCollection?.edges ?? [])
        .flat(),
    ];

    queryClient.removeQueries({
      queryKey: ["tempTourAfterInsertion"],
    });

    if (!isAllPagesFetched) {
      mergedOldEdges.pop();
    }

    const chunkedEdges = arraySliceIntoChunks(
      mergedOldEdges,
      10
    ) as ToursEdge[][];

    chunkedEdges.forEach((edgeOfPage, indexEdgeOfPage) => {
      const hasNextPage: boolean = (() => {
        if (indexEdgeOfPage === chunkedEdges.length - 1) {
          if (isAllPagesFetched) {
            return false;
          }

          return true;
        }

        return true;
      })();

      queryClient.setQueryData(
        [
          "tours",
          {
            orderBy: { created_at: OrderByDirection.DescNullsLast },
            page: indexEdgeOfPage + 1,
          },
        ],
        () => {
          const newState: {
            toursCollection: Query["toursCollection"];
          } = {
            toursCollection: {
              edges: edgeOfPage,
              pageInfo: {
                endCursor: edgeOfPage[edgeOfPage.length - 1].cursor,
                hasNextPage: hasNextPage,
                hasPreviousPage:
                  chunkedEdges.length > 0 && indexEdgeOfPage !== 0,
                startCursor: edgeOfPage[0].cursor,
              },
            },
          };

          return newState;
        }
      );
    });
  };

  const handleCacheUpdateOnSuccessUpdateTour = (
    data: UpdateToursCollectionMutation,
    fieldsChanged: string[]
  ) => {
    queryClient.setQueriesData<ToursCollectionQuery>(
      { predicate: (query) => query.queryKey.includes("tours") },
      (oldData): ToursCollectionQuery => {
        if (!oldData) {
          return {
            toursCollection: {
              edges: [],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                endCursor: null,
                startCursor: null,
              },
              __typename: "toursConnection",
            },
          };
        }

        return {
          toursCollection: {
            edges: (oldData?.toursCollection?.edges ?? []).map((item) => {
              if (item.node.id === data.updatetoursCollection.records[0].id) {
                return {
                  cursor: item.cursor,
                  node: {
                    ...item,
                    ...data.updatetoursCollection.records[0],
                  },
                };
              }

              return item;
            }),
            pageInfo: {
              hasNextPage: oldData.toursCollection?.pageInfo
                .hasNextPage as boolean,
              hasPreviousPage: oldData.toursCollection?.pageInfo
                .hasPreviousPage as boolean,
              endCursor: oldData.toursCollection?.pageInfo.endCursor,
              startCursor: oldData.toursCollection?.pageInfo.startCursor,
            },
          },
        };
      }
    );

    if (fieldsChanged.includes("publish")) {
      queryClient.removeQueries({
        queryKey: ["tours"],
        type: "all",
      });
    }
  };

  return {
    handleCacheUpdateOnSuccessCreateTour,
    handleCacheUpdateOnSuccessUpdateTour,
  };
};

export default TemplatePageTours;
