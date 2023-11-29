/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation DeleteFromToursCollection($atMost: Int!, $filter: toursFilter) {\n    deleteFromtoursCollection(atMost: $atMost, filter: $filter) {\n      affectedCount\n      records {\n        id\n        name\n      }\n    }\n  }\n": types.DeleteFromToursCollectionDocument,
    "\n    mutation InsertIntoToursCollection(\n      $name: String!\n      $availability: Int\n      $capacity: Int\n      $city: String!\n      $description: String\n      $is_published: Boolean\n      $photos: [JSON]\n      $price: Int\n    ) {\n      insertIntotoursCollection(\n        objects: {\n          name: $name\n          availability: $availability\n          capacity: $capacity\n          city: $city\n          description: $description\n          is_published: $is_published\n          photos: $photos\n          price: $price\n        }\n      ) {\n        records {\n          id\n          name\n          availability\n          capacity\n          city\n          description\n          is_published\n          photos\n          price\n          created_by\n          created_at\n          updated_at\n          __typename\n        }\n      }\n    }\n  ": types.InsertIntoToursCollectionDocument,
    "\n    mutation UpdateToursCollection(\n      $set: toursUpdateInput!\n      $filter: toursFilter\n      $atMost: Int!\n    ) {\n      updatetoursCollection(set: $set, filter: $filter, atMost: $atMost) {\n        affectedCount\n        records {\n          id\n          name\n          availability\n          capacity\n          city\n          description\n          is_published\n          photos\n          price\n          created_by\n          __typename\n        }\n        __typename\n      }\n    }\n  ": types.UpdateToursCollectionDocument,
    "\n    query ToursCollection(\n      $filter: toursFilter\n      $orderBy: [toursOrderBy!]\n      $first: Int\n      $last: Int\n      $after: Cursor\n      $before: Cursor\n    ) {\n      toursCollection(\n        filter: $filter\n        orderBy: $orderBy\n        first: $first\n        last: $last\n        after: $after\n        before: $before\n      ) {\n        edges {\n          cursor\n          node {\n            id\n            name\n            availability\n            capacity\n            city\n            description\n            is_published\n            photos\n            price\n            created_by\n            __typename\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  ": types.ToursCollectionDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteFromToursCollection($atMost: Int!, $filter: toursFilter) {\n    deleteFromtoursCollection(atMost: $atMost, filter: $filter) {\n      affectedCount\n      records {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteFromToursCollection($atMost: Int!, $filter: toursFilter) {\n    deleteFromtoursCollection(atMost: $atMost, filter: $filter) {\n      affectedCount\n      records {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation InsertIntoToursCollection(\n      $name: String!\n      $availability: Int\n      $capacity: Int\n      $city: String!\n      $description: String\n      $is_published: Boolean\n      $photos: [JSON]\n      $price: Int\n    ) {\n      insertIntotoursCollection(\n        objects: {\n          name: $name\n          availability: $availability\n          capacity: $capacity\n          city: $city\n          description: $description\n          is_published: $is_published\n          photos: $photos\n          price: $price\n        }\n      ) {\n        records {\n          id\n          name\n          availability\n          capacity\n          city\n          description\n          is_published\n          photos\n          price\n          created_by\n          created_at\n          updated_at\n          __typename\n        }\n      }\n    }\n  "): (typeof documents)["\n    mutation InsertIntoToursCollection(\n      $name: String!\n      $availability: Int\n      $capacity: Int\n      $city: String!\n      $description: String\n      $is_published: Boolean\n      $photos: [JSON]\n      $price: Int\n    ) {\n      insertIntotoursCollection(\n        objects: {\n          name: $name\n          availability: $availability\n          capacity: $capacity\n          city: $city\n          description: $description\n          is_published: $is_published\n          photos: $photos\n          price: $price\n        }\n      ) {\n        records {\n          id\n          name\n          availability\n          capacity\n          city\n          description\n          is_published\n          photos\n          price\n          created_by\n          created_at\n          updated_at\n          __typename\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateToursCollection(\n      $set: toursUpdateInput!\n      $filter: toursFilter\n      $atMost: Int!\n    ) {\n      updatetoursCollection(set: $set, filter: $filter, atMost: $atMost) {\n        affectedCount\n        records {\n          id\n          name\n          availability\n          capacity\n          city\n          description\n          is_published\n          photos\n          price\n          created_by\n          __typename\n        }\n        __typename\n      }\n    }\n  "): (typeof documents)["\n    mutation UpdateToursCollection(\n      $set: toursUpdateInput!\n      $filter: toursFilter\n      $atMost: Int!\n    ) {\n      updatetoursCollection(set: $set, filter: $filter, atMost: $atMost) {\n        affectedCount\n        records {\n          id\n          name\n          availability\n          capacity\n          city\n          description\n          is_published\n          photos\n          price\n          created_by\n          __typename\n        }\n        __typename\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query ToursCollection(\n      $filter: toursFilter\n      $orderBy: [toursOrderBy!]\n      $first: Int\n      $last: Int\n      $after: Cursor\n      $before: Cursor\n    ) {\n      toursCollection(\n        filter: $filter\n        orderBy: $orderBy\n        first: $first\n        last: $last\n        after: $after\n        before: $before\n      ) {\n        edges {\n          cursor\n          node {\n            id\n            name\n            availability\n            capacity\n            city\n            description\n            is_published\n            photos\n            price\n            created_by\n            __typename\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  "): (typeof documents)["\n    query ToursCollection(\n      $filter: toursFilter\n      $orderBy: [toursOrderBy!]\n      $first: Int\n      $last: Int\n      $after: Cursor\n      $before: Cursor\n    ) {\n      toursCollection(\n        filter: $filter\n        orderBy: $orderBy\n        first: $first\n        last: $last\n        after: $after\n        before: $before\n      ) {\n        edges {\n          cursor\n          node {\n            id\n            name\n            availability\n            capacity\n            city\n            description\n            is_published\n            photos\n            price\n            created_by\n            __typename\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;