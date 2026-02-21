import {
  BaseSyntheticEvent,
  DetailedHTMLProps,
  FC,
  FormHTMLAttributes,
  MouseEventHandler,
  useState,
} from "react";

import { XCircleIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import slugify from "slugify";

import Button from "src/components/Atoms/Button";
import FileInput, {
  ImgContainer,
} from "src/components/Atoms/FormInput/FileInput";
import SpinnerMini from "src/components/Atoms/SpinnerMini";
import Textarea from "src/components/Atoms/FormInput/TextArea";
import ToggleSwitch from "src/components/Atoms/FormInput/ToggleSwitch";
import Form from "src/components/Molecules/Form/Form";
import PreviewPhotoList from "src/components/Molecules/PreviewPhotoList";
import RowFormHorizontal, {
  RowFormPreviewMultipleImagesUpload,
} from "src/components/Molecules/Form/RowFormHorizontal";
import {
  ContainerModalContentOverflowYScroll,
  Trigger_CloseModal,
} from "src/components/Organisms/Modal";

import {
  requestCreateTour,
  requestUpdateTour,
} from "src/API/GraphQL/Mutation/ToursCollection";
import {
  requestToursCollection,
  requestToursCollectionByUsedSlug,
} from "src/API/GraphQL/Query/ToursCollection";
import { requestPhotoDelete } from "src/API/REST/POST/Storage";
import { cookieKey } from "src/Global/Constants";
import {
  OrderByDirection,
  Query,
  UpdateToursCollectionMutation,
} from "src/gql/graphql";
import useClientCookie from "src/hooks/useClientCookie";
import { useDebounce } from "src/hooks/useDebounceValue";
import { validateRequirementOfMandatory } from "src/utils/InputValidation";
import { isValidSlug } from "src/utils/RegExp";
import { useUpdateEffect } from "src/hooks/useUpdateEffect";
import FloatingInput from "src/components/Atoms/FormInput/FloatingInput";
import RowFormVertical from "src/components/Molecules/Form/RowFormVertical";

const ThumbnailsPhotoToUploadPreview: FC<{
  data: File[];
  onDiscardPhoto: MouseEventHandler<HTMLButtonElement>;
}> = ({ data = [], onDiscardPhoto }) => {
  if (data.length === 0) return null;

  return (
    <>
      {data.map((fileObject) => (
        <ImgContainer key={fileObject.name}>
          <button
            name={fileObject.name}
            onClick={(e) => {
              if (onDiscardPhoto) onDiscardPhoto(e);
            }}
            type="button"
            value={fileObject.name}
          >
            <XCircleIcon
              height={24}
              width={24}
              color="var(--color-grey-800)"
              fill="var(--color-zinc-100)"
              strokeOpacity={0.5}
            />
          </button>

          <img
            src={URL.createObjectURL(fileObject as Blob)}
            height={160}
            width={240}
            style={{ objectFit: "cover" }}
          />
        </ImgContainer>
      ))}
    </>
  );
};

type FormTour_State_DefaultValue_Object = {
  name: string;
  slug: string;
  availability: number;
  capacity: number;
  city: string;
  description: string;
  price: number;
  photos: Array<{ id: string; location: string }> | [];
  publish: boolean;
};

type FormTour_State_Object = {
  name: { error: string; isRequired?: boolean; value: string };
  slug: { error: string; isRequired?: boolean; value: string };
  availability: { error: string; isRequired?: boolean; value: number };
  capacity: { error: string; isRequired?: boolean; value: number };
  city: { error: string; isRequired?: boolean; value: string };
  description: { error: string; isRequired?: boolean; value: string };
  price: { error: string; isRequired?: boolean; value: number };
  photos: {
    error: string;
    isTouched: boolean;
    isRequired?: boolean;
    value: Array<{ id: string; location: string }>;
  };
  photosToUpload: {
    error: string;
    isTouched: boolean;
    isRequired?: boolean;
    value: Array<File>;
  };
  publish: { error: string; isRequired?: boolean; value: boolean };
};

const FormTour: FC<
  DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    closeModal?: Trigger_CloseModal;
    defaultInputValue?: FormTour_State_DefaultValue_Object;
    mode: "add" | "edit";
    onSuccessCreate?: (data: Query) => void;
    onSuccessUpdate?: (
      allData: UpdateToursCollectionMutation,
      fieldsChanged: string[]
    ) => void;
    type?: "regular" | "modal";
  }
> = ({
  closeModal,
  defaultInputValue = {
    name: "",
    slug: "",
    availability: 0,
    capacity: 0,
    city: "",
    description: "",
    price: 0,
    photos: [],
    publish: false,
  },
  itemID,
  mode,
  onSuccessCreate,
  onSuccessUpdate,
  type = "regular",
}) => {
  const [form, setForm] = useState<FormTour_State_Object>({
    name: {
      error: "",
      isRequired: true,
      value: defaultInputValue.name,
    },
    slug: {
      error: "",
      isRequired: true,
      value: defaultInputValue.slug,
    },
    availability: {
      error: "",
      value: defaultInputValue.availability,
    },
    capacity: { error: "", value: defaultInputValue.capacity },
    city: {
      error: "",
      isRequired: true,
      value: defaultInputValue.city,
    },
    description: {
      error: "",
      value: defaultInputValue.description,
    },
    price: { error: "", value: defaultInputValue.price },
    photos: { error: "", isTouched: false, value: defaultInputValue.photos },
    photosToUpload: { error: "", isTouched: false, value: [] },
    publish: { error: "", value: defaultInputValue.publish },
  });

  const [shouldAutoGenerateSlug, setShouldAutoGenerateSlug] = useState<boolean>(
    mode === "add"
  );

  const { getCookie } = useClientCookie();
  const debouncedValue = useDebounce<string>(form.slug.value, 500);
  const queryClient = useQueryClient();

  const getChangedFields = (formState: FormTour_State_Object): string[] => {
    const fieldsChanged: Array<string> = [];

    for (const inputName in formState) {
      if (
        typeof formState[inputName as keyof FormTour_State_Object].value ===
          "boolean" ||
        typeof formState[inputName as keyof FormTour_State_Object].value ===
          "number" ||
        typeof formState[inputName as keyof FormTour_State_Object].value ===
          "string"
      ) {
        if (
          formState[inputName as keyof FormTour_State_Object].value !==
          defaultInputValue[
            inputName as keyof FormTour_State_DefaultValue_Object
          ]
        ) {
          fieldsChanged.push(inputName);
        }
      }

      if (
        (inputName === "photos" || inputName === "photosToUpload") &&
        formState[inputName].isTouched
      ) {
        fieldsChanged.push(inputName);
      }
    }

    return fieldsChanged;
  };

  const { isPending: isPendingOnCreateTour, mutate: mutateCreateTour } =
    useMutation({
      gcTime: 0,
      mutationFn: async (payload: {
        name: FormDataEntryValue | null;
        slug: FormDataEntryValue | null;
        availability: FormDataEntryValue | null;
        capacity: FormDataEntryValue | null;
        city: FormDataEntryValue | null;
        description: FormDataEntryValue | null;
        price: FormDataEntryValue | null;
        photosToUpload: Array<File>;
        publish: FormDataEntryValue | null;
      }) => {
        return await requestCreateTour({
          payload: {
            name: payload.name as string,
            slug: payload.slug as string,
            availability: Number(payload.availability),
            capacity: Number(payload.capacity),
            city: payload.city as string,
            description: payload.description as string,
            photosToUpload: { bucket: "tours", data: payload.photosToUpload },
            price: Number(payload.price),
            publish: Boolean(payload.publish),
          },
          token: getCookie(cookieKey) ?? "",
        });
      },
      onError: (error) => {
        if (
          error.message.startsWith(
            'duplicate key value violates unique constraint "tours_slug_key"'
          )
        ) {
          setForm((prevState) => ({
            ...prevState,
            slug: {
              ...prevState.slug,
              error: "Slug is already taken",
            },
          }));

          toast.error("Slug is already taken");

          return;
        }

        toast.error(error.message);
      },
      onSuccess: async () => {
        const insertedTour: Query = await queryClient.fetchQuery({
          queryFn: async () =>
            await requestToursCollection(
              {
                orderBy: { created_at: OrderByDirection.DescNullsLast },
                first: 1,
              },
              getCookie(cookieKey) ?? ""
            ),
          queryKey: ["tempTourAfterInsertion"],
        });

        queryClient.removeQueries({
          queryKey: [
            "toursBySlug",
            {
              slug: insertedTour.toursCollection?.edges[0].node.slug,
            },
          ],
        });

        if (onSuccessCreate) {
          onSuccessCreate(insertedTour);
        }

        closeModal?.();
      },
    });

  const { isPending: isPendingOnUpdateTour, mutate: mutateUpdateTour } =
    useMutation({
      gcTime: 0,
      mutationFn: async () => {
        const data: Record<string, unknown> = {};

        getChangedFields(form).forEach((field) => {
          if (field !== "photos" && field !== "photosToUpload") {
            data[field as keyof typeof data] =
              form[field as keyof FormTour_State_Object].value;
          }
        });

        if (form.photos.isTouched) {
          if (!data.photos) {
            Object.defineProperty(data, "photos", {
              enumerable: true,
              value: { existing: form.photos.value },
            });
          } else {
            (
              data.photos as {
                existing: Array<{ id: string; location: string }>;
              }
            ).existing = form.photos.value;
          }
        }

        if (form.photosToUpload.isTouched) {
          if (!data.photos) {
            Object.defineProperty(data, "photos", {
              enumerable: true,
              value: { new: [...form.photosToUpload.value] },
            });
          } else {
            (data.photos as { new: File[] }).new = form.photosToUpload.value;
          }
        }

        // If user do photo deletion on existing tour, then we will delete the photo objects in bucket
        if (form.photos.isTouched) {
          const photosToDelete: { id: string; location: string }[] =
            defaultInputValue.photos.filter(
              (initialLoadedPhoto) =>
                !form.photos.value.some(
                  (photoWillBeSaved) =>
                    initialLoadedPhoto.id === photoWillBeSaved.id
                )
            );

          if (photosToDelete.length > 0) {
            await Promise.all(
              photosToDelete.map(async (photo) => {
                return await requestPhotoDelete({
                  bucket: "tours",
                  filename: photo.location.split("/")[1],
                  token: getCookie(cookieKey) ?? "",
                });
              })
            );
          }
        }

        return await requestUpdateTour({
          bucket: "tours",
          payload: {
            data,
            tourId: itemID as string,
          },
          token: getCookie(cookieKey) ?? "",
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: (data) => {
        if (
          mode === "edit" &&
          data.updatetoursCollection.records[0].slug !== defaultInputValue.slug
        ) {
          queryClient.removeQueries({
            queryKey: [
              "toursBySlug",
              {
                slug: defaultInputValue.slug,
              },
            ],
          });
        }

        queryClient.removeQueries({
          queryKey: [
            "toursBySlug",
            {
              slug: data.updatetoursCollection.records[0].slug,
            },
          ],
        });

        if (onSuccessUpdate) {
          onSuccessUpdate(data, getChangedFields(form));
        }

        closeModal?.();
      },
    });

  const {
    data: dataToursBySlug,
    isLoading,
    isSuccess,
  } = useQuery({
    enabled:
      !form.slug.error &&
      !debouncedValue.isLoading &&
      debouncedValue.value.length > 0,
    gcTime: (5 * 60) & 1000,
    queryFn: async () => {
      if (form.slug.error) return;
      if (!debouncedValue.value || !isValidSlug.test(debouncedValue.value))
        return null;

      const response = await requestToursCollectionByUsedSlug(
        debouncedValue.value,
        getCookie(cookieKey) ?? ""
      );

      setShouldAutoGenerateSlug(false);

      if (response) return response;

      return null;
    },
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      "toursBySlug",
      {
        slug:
          !isValidSlug.test(debouncedValue.value) || debouncedValue.isLoading
            ? ""
            : debouncedValue.value,
      },
    ],
    staleTime: 5 * 60 * 1000,
  });

  useUpdateEffect(() => {
    if (isSuccess) {
      setForm((prevState) => ({
        ...prevState,
        slug: {
          ...prevState.slug,
          error:
            (dataToursBySlug?.toursCollection?.edges ?? []).length > 0 &&
            dataToursBySlug?.toursCollection?.edges[0].node.id !== itemID
              ? "Slug is already taken"
              : "",
        },
      }));
    }
  }, [isSuccess]);

  const onSubmit = async (
    e: BaseSyntheticEvent,
    submittedFormState: FormTour_State_Object
  ) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    let countInputsValidationFails = 0;

    for (const inputName in form) {
      if (
        form[inputName as keyof FormTour_State_Object].isRequired &&
        typeof data.get(inputName) === "string"
      ) {
        if (!validateRequirementOfMandatory(data.get(inputName) as string)) {
          submittedFormState[inputName as keyof FormTour_State_Object].error =
            "This field is required";
          countInputsValidationFails = countInputsValidationFails + 1;
        } else {
          if (inputName !== "slug") {
            submittedFormState[inputName as keyof FormTour_State_Object].error =
              "";
          }

          if (inputName === "slug") {
            if (!isValidSlug.test(data.get(inputName) as string)) {
              submittedFormState[
                inputName as keyof FormTour_State_Object
              ].error = "Please fill with the valid slug";

              countInputsValidationFails = countInputsValidationFails + 1;
            } else if (
              submittedFormState[inputName as keyof FormTour_State_Object]
                .error === "Slug is already taken"
            ) {
              countInputsValidationFails = countInputsValidationFails + 1;
            } else {
              submittedFormState[
                inputName as keyof FormTour_State_Object
              ].error = "";
            }
          }
        }
      }
    }

    if (countInputsValidationFails > 0) {
      setForm(submittedFormState);
      return;
    }

    if (mode === "add") {
      mutateCreateTour({
        availability: data.get("availability"),
        capacity: data.get("capacity"),
        city: data.get("city"),
        description: data.get("description"),
        name: data.get("name"),
        photosToUpload: submittedFormState.photosToUpload.value,
        price: data.get("price"),
        publish: data.get("publish"),
        slug: data.get("slug"),
      });
    } else {
      mutateUpdateTour();
    }
  };

  const shouldSaveButtonDisabled = (
    isLoading: boolean,
    mode: "add" | "edit"
  ): boolean => {
    if (isLoading) return true;

    const photosChanged: boolean = (() => {
      if (mode === "edit") {
        return form.photos.isTouched || form.photosToUpload.isTouched;
      }

      return form.photosToUpload.isTouched;
    })();

    return (
      form.name.value === defaultInputValue.name &&
      form.slug.value === defaultInputValue.slug &&
      form.availability.value === defaultInputValue.availability &&
      form.capacity.value === defaultInputValue.capacity &&
      form.city.value === defaultInputValue.city &&
      form.description.value === defaultInputValue.description &&
      form.price.value === defaultInputValue.price &&
      !photosChanged &&
      form.publish.value === defaultInputValue.publish
    );
  };

  const textButtonSave = mode === "edit" ? "Save changes" : "Create new tour";

  return (
    <Form type={type} onSubmit={(e) => onSubmit(e, { ...form })}>
      <ContainerModalContentOverflowYScroll $height={70}>
        <RowFormHorizontal error={form.name.error}>
          <FloatingInput
            disabled={isPendingOnCreateTour || isPendingOnUpdateTour}
            label="Name"
            name="name"
            onBlur={(e) => {
              setShouldAutoGenerateSlug(false);

              if (validateRequirementOfMandatory(e.target.value)) return;

              setForm((prevState) => ({
                ...prevState,
                name: { ...prevState.name, error: "This field is required" },
              }));
            }}
            onChange={(e) => {
              setForm((prevState) => {
                const newState = {
                  ...prevState,
                  name: {
                    ...prevState.name,
                    error: validateRequirementOfMandatory(e.target.value)
                      ? ""
                      : "This field is required",
                    value: e.target.value,
                  },
                };

                if (shouldAutoGenerateSlug) {
                  newState.slug = {
                    ...prevState.slug,
                    error: "",
                    value: slugify(e.target.value, { lower: true }),
                  };
                }

                return newState;
              });
            }}
            type="text"
            value={form.name.value}
          />
        </RowFormHorizontal>

        <RowFormHorizontal
          error={form.slug.error}
          loading={debouncedValue.isLoading === true || isLoading}
          showValidIcon={form.slug.value.length > 0}
        >
          <FloatingInput
            disabled={isPendingOnCreateTour || isPendingOnUpdateTour}
            label="Slug"
            name="slug"
            onBlur={(e) => {
              if (validateRequirementOfMandatory(e.target.value)) return;

              setForm((prevState) => ({
                ...prevState,
                slug: { ...prevState.slug, error: "This field is required" },
              }));
            }}
            onChange={(e) => {
              const slug = slugify(e.target.value, {
                lower: true,
                trim: false,
              });

              const error =
                (validateRequirementOfMandatory(e.target.value)
                  ? ""
                  : "This field is required") ||
                (isValidSlug.test(slug)
                  ? ""
                  : "Please fill with the valid slug");

              setForm((prevState) => ({
                ...prevState,
                slug: {
                  ...prevState.name,
                  error,
                  value: slug,
                },
              }));
            }}
            type="text"
            value={form.slug.value}
          />
        </RowFormHorizontal>

        <RowFormHorizontal error={form.availability.error}>
          <FloatingInput
            disabled={isPendingOnCreateTour || isPendingOnUpdateTour}
            label="Availability"
            min={0}
            name="availability"
            onChange={(e) =>
              setForm((prevState) => ({
                ...prevState,
                availability: {
                  ...prevState.availability,
                  value: Number(e.target.value),
                },
              }))
            }
            type="number"
            value={form.availability.value.toString()}
          />
        </RowFormHorizontal>

        <RowFormHorizontal error={form.capacity.error}>
          <FloatingInput
            disabled={isPendingOnCreateTour || isPendingOnUpdateTour}
            min={0}
            label="Capacity"
            name="capacity"
            onChange={(e) =>
              setForm((prevState) => ({
                ...prevState,
                capacity: {
                  ...prevState.capacity,
                  value: Number(e.target.value),
                },
              }))
            }
            type="number"
            value={form.capacity.value.toString()}
          />
        </RowFormHorizontal>

        <RowFormHorizontal error={form.city.error}>
          <FloatingInput
            disabled={isPendingOnCreateTour || isPendingOnUpdateTour}
            label="City"
            name="city"
            onBlur={(e) => {
              if (validateRequirementOfMandatory(e.target.value)) return;

              setForm((prevState) => ({
                ...prevState,
                city: { ...prevState.city, error: "This field is required" },
              }));
            }}
            onChange={(e) => {
              setForm((prevState) => ({
                ...prevState,
                city: {
                  ...prevState.city,
                  error: validateRequirementOfMandatory(e.target.value)
                    ? ""
                    : "This field is required",
                  value: e.target.value,
                },
              }));
            }}
            type="text"
            value={form.city.value}
          />
        </RowFormHorizontal>

        <RowFormVertical error={form.description.error} label="Description">
          <Textarea
            aria-multiline={true}
            disabled={isPendingOnCreateTour || isPendingOnUpdateTour}
            name="description"
            onChange={(e) =>
              setForm((prevState) => ({
                ...prevState,
                description: {
                  ...prevState.description,
                  value: e.target.value,
                },
              }))
            }
            value={form.description.value}
          />
        </RowFormVertical>

        <RowFormHorizontal error={form.price.error}>
          <FloatingInput
            disabled={isPendingOnCreateTour || isPendingOnUpdateTour}
            label="Price"
            min={0}
            name="price"
            onChange={(e) =>
              setForm((prevState) => ({
                ...prevState,
                price: { ...prevState.price, value: Number(e.target.value) },
              }))
            }
            type="number"
            value={form.price.value.toString()}
          />
        </RowFormHorizontal>

        {mode === "edit" && form.photos.value.length > 0 && (
          <RowFormHorizontal
            grid={{ templateColumns: "24rem 1fr" }}
            label="Photos"
          >
            <RowFormPreviewMultipleImagesUpload>
              <PreviewPhotoList
                data={form.photos.value.map((photo) => ({
                  id: photo.id,
                  src: `${
                    import.meta.env.VITE_URL_SERVER
                  }/storage/v1/object/public/${photo.location}`,
                }))}
                onDiscardPhoto={(e) => {
                  const photoId = e.currentTarget.value;

                  setForm((prevState) => {
                    const newState = { ...prevState };

                    if (!prevState.photos.isTouched) {
                      newState.photos.isTouched = true;
                    }

                    return {
                      ...newState,
                      photos: {
                        ...newState.photos,
                        value: newState.photos.value.filter(
                          (photo) => photo.id !== photoId
                        ),
                      },
                    };
                  });
                }}
              />
            </RowFormPreviewMultipleImagesUpload>
          </RowFormHorizontal>
        )}

        <RowFormHorizontal label="Upload photo for Tour">
          <FileInput
            accept=".jpg, .jpeg, .webp"
            name="uploadPhotoForTour"
            multiple
            onChange={(e) => {
              if (
                !e.target.files ||
                (e.target.files && e.target.files.length === 0)
              )
                return;

              let selectedFiles = Array.from(e.target.files);

              if (form.photosToUpload) {
                // Exclude file that already exist on the state
                selectedFiles = selectedFiles.filter(
                  (itemSelectedFile) =>
                    !form.photosToUpload.value.some(
                      (itemOnState) =>
                        itemOnState?.name === itemSelectedFile.name
                    )
                );
              }

              setForm((prevState) => {
                const newState = { ...prevState };

                if (!prevState.photosToUpload.isTouched) {
                  newState.photosToUpload.isTouched = true;
                }

                return {
                  ...newState,
                  photosToUpload: {
                    ...newState.photosToUpload,
                    value: [...newState.photosToUpload.value, ...selectedFiles],
                  },
                };
              });

              // Clear values after select is done to allow next selection (if we do a remove then choosing same file)
              e.target.value = "";
            }}
          />
        </RowFormHorizontal>

        {form.photosToUpload.value.length > 0 && (
          <RowFormPreviewMultipleImagesUpload>
            <ThumbnailsPhotoToUploadPreview
              data={form.photosToUpload.value}
              onDiscardPhoto={(e) => {
                const value = e.currentTarget.value;

                setForm((prevState) => ({
                  ...prevState,
                  photosToUpload: {
                    ...prevState.photosToUpload,
                    value: prevState.photosToUpload.value.filter(
                      (photo) => photo.name !== value
                    ),
                  },
                }));
              }}
            />
          </RowFormPreviewMultipleImagesUpload>
        )}

        <RowFormHorizontal label="Publish?">
          <ToggleSwitch
            defaultChecked={defaultInputValue?.publish}
            height={20}
            id={
              defaultInputValue?.name
                ? `toggle-publish-${defaultInputValue.name}`
                : `toggle-publish`
            }
            name="publish"
            onChange={(e) =>
              setForm((prevState) => ({
                ...prevState,
                publish: { ...prevState.publish, value: e.target.checked },
              }))
            }
          />
        </RowFormHorizontal>
      </ContainerModalContentOverflowYScroll>

      <RowFormHorizontal grid={{ justifyItems: "end", templateColumns: "1fr" }}>
        <RowFormHorizontal
          grid={{ display: "inline-grid", templateColumns: "repeat(2, auto)" }}
        >
          <>
            <Button
              $size="medium"
              $variation="secondary"
              disabled={isPendingOnCreateTour || isPendingOnUpdateTour}
              onClick={() => closeModal?.()}
              type="button"
            >
              Cancel
            </Button>

            <Button
              $flex={{ alignItems: "center", gap: ".4rem" }}
              $size="medium"
              disabled={shouldSaveButtonDisabled(
                isPendingOnCreateTour ||
                  isPendingOnUpdateTour ||
                  debouncedValue.isLoading === true,
                mode
              )}
              type="submit"
            >
              {isPendingOnCreateTour || isPendingOnUpdateTour ? (
                <>
                  <SpinnerMini height={"1.6rem"} width={"1.6rem"} />
                  <span>Saving</span>
                </>
              ) : (
                <span>{textButtonSave}</span>
              )}
            </Button>
          </>
        </RowFormHorizontal>
      </RowFormHorizontal>
    </Form>
  );
};

export default FormTour;
