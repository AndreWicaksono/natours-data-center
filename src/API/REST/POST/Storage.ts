import { generateDuplicateFilename } from "src/utils/String";

export const isFilenameExistOnBucket = async ({
  bucket,
  filenameWithoutExtension,
  token,
}: {
  bucket: string;
  filenameWithoutExtension: string;
  token: string;
}) => {
  const response = await fetch(
    `${import.meta.env.VITE_URL_SERVER}/storage/v1/object/list/${bucket}`,
    {
      body: JSON.stringify({
        prefix: "",
        search: filenameWithoutExtension,
        sortBy: {
          column: "created_at",
          order: "desc",
        },
      }),
      headers: {
        apiKey: import.meta.env.VITE_KEY_PUBLIC,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  );

  if (!response.ok) {
    const errorDetail: { error: string; message: string; statusCode: string } =
      await response.json();

    throw Error(errorDetail.message);
  }

  const data = await response.json();

  return data;
};

export const requestPhotoDelete = async ({
  bucket,
  filename,
  token,
}: {
  bucket: string;
  filename: string;
  token: string;
}) => {
  const response = await fetch(
    `${
      import.meta.env.VITE_URL_SERVER
    }/storage/v1/object/${bucket}/${filename}`,
    {
      headers: {
        apiKey: import.meta.env.VITE_KEY_PUBLIC,
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorDetail: { error: string; message: string; statusCode: string } =
      await response.json();

    throw Error(errorDetail.error);
  }

  const data = await response.json();

  return data;
};

export const requestPhotoUploadToStorage = async ({
  bucket,
  file,
  newFilename,
  token,
}: {
  bucket: string;
  file: File;
  newFilename?: string;
  token: string;
}) => {
  const response = await fetch(
    `${import.meta.env.VITE_URL_SERVER}/storage/v1/object/${bucket}/${
      newFilename || file.name
    }`,
    {
      body: file,
      headers: {
        apiKey: import.meta.env.VITE_KEY_PUBLIC,
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
    }
  );

  if (!response.ok) {
    const errorDetail: { error: string; message: string; statusCode: string } =
      await response.json();

    throw Error(errorDetail.error);
  }

  const data = await response.json();

  return data;
};

export const requestPhotosUploadToStorageWithDuplicationHandler = async ({
  bucket,
  payload,
  token,
}: {
  bucket: string;
  payload: Array<File>;
  token: string;
}): Promise<Array<{ id: string; location: string }>> => {
  return await Promise.all(
    payload.map(async (photoFile) => {
      const duplicateList = await isFilenameExistOnBucket({
        bucket: bucket,
        filenameWithoutExtension: photoFile.name.split(".")[0],
        token: token,
      });

      const responseBucket: { Id: string; Key: string } =
        await requestPhotoUploadToStorage({
          bucket: bucket,
          file: photoFile,
          newFilename:
            duplicateList.length > 0
              ? generateDuplicateFilename(duplicateList[0].name)
              : "",
          token: token,
        });

      return {
        id: responseBucket.Id,
        location: responseBucket.Key,
      };
    })
  );
};
