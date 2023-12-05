import request from "graphql-request";

import { graphql } from "src/gql";
import {
  ToursCollectionQuery,
  ToursCollectionQueryVariables,
} from "src/gql/graphql";

export const Query_Document_ToursCollection = graphql(`
  query ToursCollection(
    $filter: toursFilter
    $orderBy: [toursOrderBy!]
    $first: Int
    $last: Int
    $after: Cursor
    $before: Cursor
  ) {
    toursCollection(
      filter: $filter
      orderBy: $orderBy
      first: $first
      last: $last
      after: $after
      before: $before
    ) {
      edges {
        cursor
        node {
          id
          name
          availability
          capacity
          city
          description
          is_published
          photos
          price
          created_by
          __typename
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`);

export const requestToursCollection = async (
  queryVariables: ToursCollectionQueryVariables,
  token: string
): Promise<ToursCollectionQuery> => {
  return await request(
    import.meta.env.VITE_URL_GRAPHQL,
    Query_Document_ToursCollection,
    queryVariables,
    {
      apiKey: import.meta.env.VITE_KEY_PUBLIC,
      authorization: `Bearer ${token}` ?? "",
      "Content-Type": "application/json",
    }
  );
};
