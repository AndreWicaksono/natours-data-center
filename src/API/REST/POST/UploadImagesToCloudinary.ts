export const processImagesOnCloudinary = async ({
  action,
  fillFormData,
}: {
  action: "upload" | "delete";
  fillFormData: (form: FormData) => void;
}): Promise<Response> => {
  const formData = new FormData();

  fillFormData(formData);

  const response = await fetch(
    `${import.meta.env.VITE_CLOUDINARY_URL_REST}/${
      import.meta.env.VITE_CLOUDINARY_CLOUDNAME
    }/${action}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok && response.status !== 200) throw Error;

  const files = await response.json();

  return files;
};
