import { request } from "graphql-request";

import { requestPhotosUploadToStorageWithDuplicationHandler } from "src/API/REST/POST/Storage";
import { graphql } from "src/gql";
import {
  DeleteFromToursCollectionMutation,
  InsertIntoToursCollectionMutation,
  UpdateToursCollectionMutation,
} from "src/gql/graphql";

export const Mutation_Document_DeleteFromToursCollection = graphql(`
  mutation DeleteFromToursCollection($atMost: Int!, $filter: toursFilter) {
    deleteFromtoursCollection(atMost: $atMost, filter: $filter) {
      affectedCount
      records {
        id
        name
      }
    }
  }
`);

export const Mutation_Document_InsertIntoToursCollection = graphql(`
  mutation InsertIntoToursCollection(
    $name: String!
    $slug: String!
    $availability: Int
    $capacity: Int
    $city: String!
    $description: String
    $is_published: Boolean
    $photos: [JSON]
    $price: Int
  ) {
    insertIntotoursCollection(
      objects: {
        name: $name
        slug: $slug
        availability: $availability
        capacity: $capacity
        city: $city
        description: $description
        is_published: $is_published
        photos: $photos
        price: $price
      }
    ) {
      records {
        id
        name
        slug
        availability
        capacity
        city
        description
        is_published
        photos
        price
        created_by
        created_at
        updated_at
        __typename
      }
    }
  }
`);

export const Mutation_Document_UpdateToursCollection = graphql(`
  mutation UpdateToursCollection(
    $set: toursUpdateInput!
    $filter: toursFilter
    $atMost: Int!
  ) {
    updatetoursCollection(set: $set, filter: $filter, atMost: $atMost) {
      affectedCount
      records {
        id
        name
        slug
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
      __typename
    }
  }
`);

export const requestCreateTour = async ({
  payload,
  token,
}: {
  payload: {
    name: string;
    slug: string;
    availability: number;
    capacity: number;
    city: string;
    description: string;
    price: number;
    photosToUpload: {
      bucket: string;
      data: Array<File>;
    };
    publish: boolean;
  };
  token: string;
}): Promise<InsertIntoToursCollectionMutation> => {
  const photosUploaded: Array<{ id: string; location: string }> =
    await requestPhotosUploadToStorageWithDuplicationHandler({
      bucket: payload.photosToUpload.bucket,
      payload: payload.photosToUpload.data,
      token: token,
    });

  return await request(
    import.meta.env.VITE_URL_GRAPHQL,
    Mutation_Document_InsertIntoToursCollection,
    {
      name: payload.name,
      slug: payload.slug,
      availability: payload.availability,
      capacity: payload.capacity,
      city: payload.city,
      description: payload.description,
      price: payload.price,
      photos: photosUploaded.map((item) => JSON.stringify(item)),
      is_published: payload.publish,
    },
    {
      apiKey: import.meta.env.VITE_KEY_PUBLIC,
      authorization: `Bearer ${token}` ?? "",
      "Content-Type": "application/json",
    }
  );
};

export const requestDeleteTour = async ({
  payload: { atMost, filter },
  token,
}: {
  payload: {
    atMost: number;
    filter: { id: string };
  };
  token: string;
}): Promise<DeleteFromToursCollectionMutation> => {
  return await request(
    import.meta.env.VITE_URL_GRAPHQL,
    Mutation_Document_DeleteFromToursCollection,
    {
      atMost,
      filter: {
        id: {
          eq: filter.id,
        },
      },
    },
    {
      apiKey: import.meta.env.VITE_KEY_PUBLIC,
      authorization: `Bearer ${token}` ?? "",
      "Content-Type": "application/json",
    }
  );
};

export const requestUpdateTour = async ({
  bucket,
  payload,
  token,
}: {
  bucket: string;
  payload: {
    tourId: string;
    data: {
      name?: string;
      slug?: string;
      availability?: number;
      capacity?: number;
      city?: string;
      description?: string;
      price?: number;
      photos?: {
        existing?: Array<{ id: string; location: string }>;
        new?: File[];
      };
      is_published?: boolean;
    };
  };
  token: string;
}): Promise<UpdateToursCollectionMutation> => {
  const photosUploaded: Array<{ id: string; location: string }> =
    payload.data.photos &&
    payload.data.photos.new &&
    payload.data.photos.new.length > 0
      ? await requestPhotosUploadToStorageWithDuplicationHandler({
          bucket: bucket,
          payload: payload.data.photos.new,
          token: token,
        })
      : [];

  let photos: Array<{ id: string; location: string }> = [];

  type FinalPayload_Object = Record<string, unknown>;

  const finalPayload: FinalPayload_Object = {};

  for (const field in payload.data) {
    if (field !== "photos") {
      finalPayload[field] = payload.data[field as keyof typeof payload.data];
    }
  }

  if (payload.data.photos) {
    photos = [...(payload.data.photos.existing ?? []), ...photosUploaded];

    finalPayload.photos = photos.map((item) => JSON.stringify(item));
  }

  if ("publish" in finalPayload) {
    // Rename publish property
    finalPayload["is_published"] = finalPayload["publish"];
    delete finalPayload["publish"];
  }

  return await request(
    import.meta.env.VITE_URL_GRAPHQL,
    Mutation_Document_UpdateToursCollection,
    {
      set: finalPayload,
      filter: {
        id: {
          eq: payload.tourId,
        },
      },
      atMost: 1,
    },
    {
      apiKey: import.meta.env.VITE_KEY_PUBLIC,
      authorization: `Bearer ${token}` ?? "",
      "Content-Type": "application/json",
    }
  );
};
