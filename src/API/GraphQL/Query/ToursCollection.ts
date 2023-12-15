import request from "graphql-request";

import { graphql } from "src/gql";
import {
  ToursCollectionQuery,
  ToursCollectionBySlugQuery,
  ToursCollectionQueryVariables,
  OrderByDirection,
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
          slug
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

export const Query_Document_ToursCollection_BySlug = graphql(`
  query ToursCollectionBySlug(
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
          slug
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

export const requestToursCollectionByUsedSlug = async (
  slug: string,
  token: string
): Promise<ToursCollectionBySlugQuery> => {
  return await request(
    import.meta.env.VITE_URL_GRAPHQL,
    Query_Document_ToursCollection,
    {
      filter: {
        slug: {
          eq: slug,
        },
      },
      first: 1,
      orderBy: {
        created_at: OrderByDirection.DescNullsLast,
      },
    },
    {
      apiKey: import.meta.env.VITE_KEY_PUBLIC,
      authorization: `Bearer ${token}` ?? "",
      "Content-Type": "application/json",
    }
  );
};
