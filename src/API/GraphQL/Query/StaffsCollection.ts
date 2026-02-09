import request from "graphql-request";

import { graphql } from "src/gql";
import {
  StaffsCollectionQuery,
  StaffsCollectionQueryVariables,
} from "src/gql/graphql";

export const Query_Document_StaffsCollection = graphql(`
  query StaffsCollection(
    $first: Int
    $last: Int
    $after: Cursor
    $before: Cursor
    $filter: staffsFilter
    $orderBy: [staffsOrderBy!]
  ) {
    staffsCollection(
      first: $first
      last: $last
      after: $after
      before: $before
      filter: $filter
      orderBy: $orderBy
    ) {
      edges {
        node {
          id
          first_name
          last_name
          is_active
          photo
          __typename
        }
        __typename
      }
    }
  }
`);

export const requestStaffsCollection = async (
  queryVariables: StaffsCollectionQueryVariables,
  token: string
): Promise<StaffsCollectionQuery> => {
  return await request(
    import.meta.env.VITE_URL_GRAPHQL,
    Query_Document_StaffsCollection,
    queryVariables,
    {
      apiKey: import.meta.env.VITE_KEY_PUBLIC,
      authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    }
  );
};
