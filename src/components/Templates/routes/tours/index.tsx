import {
  Dispatch,
  FC,
  RefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";

import { PlusIcon } from "@heroicons/react/20/solid";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

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
  ToursEdge,
  ToursFilter,
  ToursOrderBy,
  UpdateToursCollectionMutation,
} from "src/gql/graphql";
import useClientCookie from "src/hooks/useClientCookie";
import { useSmoothScrollIntoViewBehavior } from "src/hooks/useSmoothScrollIntoViewBehavior";
import { arraySliceIntoChunks } from "src/utils/Array";
import { clearGraphQLPaginationObjectKeys } from "src/utils/Object";

type Tours_QueryVariables_State_Object = {
  filter?: ToursFilter;
  orderBy?: ToursOrderBy;
  first?: number;
  last?: number;
  after?: string;
  before?: string;
};

const TemplatePageTours: FC = () => {
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
          // If there are photos, delete them first
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
    // Using custom dependencies for queryKey to get consistent UI behavior after row deletion (always pick 1 item from next page & append into last sequence of current page)
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

  return (
    <>
      <LayoutRow $type="horizontal" ref={refResetViewPosition}>
        <Heading as="h1">All tours</Heading>

        <TableToursDataViewOperations
          onButtonSelectionSelect={(value) =>
            setQueryVariables((prevState) => {
              const newState = { ...prevState };

              clearGraphQLPaginationObjectKeys(newState);

              if (value === "all" && newState.filter) {
                delete newState.filter;

                newState.first = 10;

                return newState;
              }

              return {
                ...newState,
                filter: {
                  is_published: { eq: value === "published" },
                },
                first: 10,
              };
            })
          }
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
      </LayoutRow>

      <LayoutRow $type="vertical">
        <TableTours
          columns={[
            {
              id: "column-tour-photo",
              label: (
                <Modal key="column-tour-photo">
                  <Modal.Open opens="tour-add-form">
                    <Button
                      $flex={{ alignItems: "center", justifyContent: "center" }}
                      $size="small"
                      disabled={isLoading}
                    >
                      <PlusIcon height={16} width={16} />
                      <span>Create</span>
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
              ),
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

                // Return initial query variables to sync with updated cache condition
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
          onSuccessUpdateRow={(data) =>
            handleCacheUpdateOnSuccessUpdateTour(data, queryKeyDependencies)
          }
          resetViewPosition={{
            behavior: resetViewPositionBehavior,
            block: "center",
            ref: refResetViewPosition,
          }}
          rows={{ data: data ?? null, isError, isLoading, isSuccess }}
        />
      </LayoutRow>
    </>
  );
};

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
    queryKeyDependencies: {
      filter: Tours_QueryVariables_State_Object["filter"];
      orderBy: Tours_QueryVariables_State_Object["orderBy"];
      page: number;
    }
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
    // If there is filter or sort condition is not default value applied then set back to default value
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
        // Only return data of default sort option
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

    // START: Transformation of the data structure before it is given to the new state
    const mergedOldEdges: Array<ToursEdge> = [
      ...(data?.toursCollection?.edges ?? []),
      ...queryData
        .map((item) => item?.[1]?.toursCollection?.edges ?? [])
        .flat(),
    ];

    // Clean up temporary cache
    queryClient.removeQueries({
      queryKey: ["tempTourAfterInsertion"],
    });

    if (!isAllPagesFetched) {
      // If the data is not from all pages, it means there is data on the next page & mergedOldEdges.length must be a multiple of 10.
      // Example: If we have 26 tours (3 pages). The result of old edges are 20 items (let say we already visit 2 pages), it will be added with 1 item (created), then the result of mergedOldData.length will be 21 and should be removed from the end of array.
      mergedOldEdges.pop();
    }

    const chunkedEdges = arraySliceIntoChunks(
      mergedOldEdges,
      10
    ) as ToursEdge[][];
    // END: Transformation of the data structure before it is given to the new state

    // Cache update for all fetched page data (default sort only)
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
    queryKeyDependencies: {
      filter: Tours_QueryVariables_State_Object["filter"];
      orderBy: Tours_QueryVariables_State_Object["orderBy"];
      page: number;
    }
  ) => {
    {
      queryClient.setQueryData(
        ["tours", queryKeyDependencies],
        (oldData: Query) => {
          return {
            toursCollection: {
              edges: oldData.toursCollection?.edges.map((item) => {
                if (item.node.id === data.updatetoursCollection.records[0].id) {
                  return {
                    node: {
                      ...item,
                      ...data.updatetoursCollection.records[0],
                    },
                  };
                }

                return item;
              }),
              pageInfo: oldData.toursCollection?.pageInfo,
            },
          };
        }
      );
    }
  };

  return {
    handleCacheUpdateOnSuccessCreateTour,
    handleCacheUpdateOnSuccessUpdateTour,
  };
};

export default TemplatePageTours;
