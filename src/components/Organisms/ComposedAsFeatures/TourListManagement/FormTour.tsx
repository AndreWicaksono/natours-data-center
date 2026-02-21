import {
  BaseSyntheticEvent,
  DetailedHTMLProps,
  FC,
  FormHTMLAttributes,
  MouseEventHandler,
  useState,
} from "react";

import { XCircleIcon as XCircleIconOutline } from "@heroicons/react/24/outline";
import {
  DocumentTextIcon,
  CubeIcon,
  XCircleIcon,
  ChatBubbleBottomCenterTextIcon,
  PhotoIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import slugify from "slugify";
import styled, { keyframes } from "styled-components";

import Button from "src/components/Atoms/Button";
import FileInput, {
  ImgContainer,
} from "src/components/Atoms/FormInput/FileInput";
import SpinnerMini from "src/components/Atoms/SpinnerMini";
import FloatingTextarea from "src/components/Atoms/FormInput/FloatingTextarea";
import ToggleSwitch from "src/components/Atoms/FormInput/ToggleSwitch";
import Form from "src/components/Molecules/Form/Form";
import PreviewPhotoList from "src/components/Molecules/PreviewPhotoList";
import { RowFormPreviewMultipleImagesUpload } from "src/components/Molecules/Form/RowFormHorizontal";
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

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ─── Form Grid Layout ─────────────────────────────────────────────────────────

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3.2rem 2.4rem;

  animation: ${fadeIn} 0.4s ease-out;

  /* Tablet: Reduce gap */
  @media (max-width: 1024px) {
    gap: 2.4rem 2rem;
  }

  /* Mobile: Single column */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  /* Make input text not overlap with icon */
  input {
    padding-right: 4rem;
  }
`;

const InputIconWrapper = styled.div`
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;

  animation: ${fadeIn} 0.3s ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  svg {
    width: 2.2rem;
    height: 2.2rem;
  }
`;

// ─── Section ──────────────────────────────────────────────────────────────────

const Section = styled.div<{ $span?: 1 | 2 }>`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  /* Span 1 or 2 columns */
  grid-column: span ${(props) => props.$span || 1};

  /* Mobile: Always span 1 */
  @media (max-width: 768px) {
    grid-column: span 1;
    gap: 1.6rem;
  }
`;

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;

  padding-bottom: 1.2rem;
  margin-bottom: 0.8rem;

  border-bottom: 2px solid var(--color-grey-200);

  transition: all 0.2s ease;

  @media (max-width: 768px) {
    padding-bottom: 1rem;
    margin-bottom: 0.6rem;
  }
`;

const SectionIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 3.6rem;
  height: 3.6rem;

  border-radius: 1rem;

  background: linear-gradient(
    135deg,
    var(--color-brand-100) 0%,
    var(--color-brand-200) 100%
  );

  color: var(--color-brand-700);

  box-shadow: 0 2px 8px rgba(85, 197, 122, 0.15);

  transition: all 0.2s ease;

  svg {
    width: 2rem;
    height: 2rem;
  }

  @media (max-width: 768px) {
    width: 3.2rem;
    height: 3.2rem;

    svg {
      width: 1.8rem;
      height: 1.8rem;
    }
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-grey-800);
  margin: 0;
  line-height: 1.2;

  transition: color 0.2s ease;

  @media (max-width: 768px) {
    font-size: 1.7rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

// ─── Field Group ──────────────────────────────────────────────────────────────

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;

  @media (max-width: 768px) {
    gap: 1.4rem;
  }
`;

// ─── Divider ──────────────────────────────────────────────────────────────────

const Divider = styled.div`
  grid-column: span 2;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--color-grey-200) 50%,
    transparent 100%
  );
  margin: 1.6rem 0;

  @media (max-width: 768px) {
    grid-column: span 1;
    margin: 1.2rem 0;
  }
`;

// ─── Actions Footer ───────────────────────────────────────────────────────────

const ActionsFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;

  padding-top: 2.4rem;
  margin-top: 2.4rem;
  border-top: 1px solid var(--color-grey-200);

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 1rem;
    padding-top: 2rem;
    margin-top: 2rem;
  }
`;

// ─── Helper Text ──────────────────────────────────────────────────────────────

const HelperText = styled.p`
  font-size: 1.3rem;
  color: var(--color-grey-500);
  margin: 0.4rem 0 0rem 0;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

// ─── Photo Upload Section ─────────────────────────────────────────────────────

const PhotoUploadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;

  padding: 2rem;
  background: var(--color-grey-50);
  border: 2px dashed var(--color-grey-300);
  border-radius: 1.2rem;

  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-brand-400);
    background: var(--color-brand-50);
  }

  @media (max-width: 768px) {
    padding: 1.6rem;
  }
`;

// ─── Publish Toggle Container ─────────────────────────────────────────────────

const PublishToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 1.6rem 2rem;
  background: var(--color-grey-50);
  border-radius: 1.2rem;
  border: 1px solid var(--color-grey-200);

  transition: all 0.2s ease;

  &:hover {
    background: var(--color-brand-50);
    border-color: var(--color-brand-300);
  }

  @media (max-width: 768px) {
    padding: 1.4rem 1.6rem;
  }
`;

const PublishLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .icon {
    display: flex;
    align-items: center;
    color: var(--color-brand-600);

    svg {
      width: 2rem;
      height: 2rem;
    }
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    .title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-grey-800);
    }

    .description {
      font-size: 1.3rem;
      color: var(--color-grey-500);
    }
  }

  @media (max-width: 768px) {
    .text {
      .title {
        font-size: 1.4rem;
      }

      .description {
        font-size: 1.2rem;
      }
    }
  }
`;

// ─── Thumbnail Preview ────────────────────────────────────────────────────────

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
            <XCircleIconOutline
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
            alt={fileObject.name}
          />
        </ImgContainer>
      ))}
    </>
  );
};

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Main Form Component ──────────────────────────────────────────────────────

const FormTour: FC<
  DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    closeModal?: Trigger_CloseModal;
    defaultInputValue?: FormTour_State_DefaultValue_Object;
    itemID?: string;
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

  const [shouldAutoGenerateSlug] = useState<boolean>(mode === "add");

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

        toast.success("Tour has been created successfully!", {
          duration: 6000,
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
      mutationFn: async ({
        payload,
        fieldsChanged,
      }: {
        payload: {
          id: string;
          name?: string;
          slug?: string;
          availability?: number;
          capacity?: number;
          city?: string;
          description?: string;
          price?: number;
          photos?: { id: string; location: string }[];
          photosToUpload?: { bucket: string; data: Array<File> };
          is_published?: boolean;
        };
        fieldsChanged: string[];
      }) => {
        const data: Record<string, unknown> = {};

        fieldsChanged.forEach((field) => {
          if (field !== "photos" && field !== "photosToUpload") {
            data[field as keyof typeof data] =
              payload[field as keyof typeof payload];
          }
        });

        if (fieldsChanged.includes("photos") && payload.photos) {
          if (!data.photos) {
            Object.defineProperty(data, "photos", {
              enumerable: true,
              value: { existing: payload.photos },
            });
          } else {
            (
              data.photos as {
                existing: Array<{ id: string; location: string }>;
              }
            ).existing = payload.photos;
          }
        }

        if (
          fieldsChanged.includes("photosToUpload") &&
          payload.photosToUpload
        ) {
          if (!data.photos) {
            Object.defineProperty(data, "photos", {
              enumerable: true,
              value: { new: [...payload.photosToUpload.data] },
            });
          } else {
            (data.photos as { new: File[] }).new = payload.photosToUpload.data;
          }
        }

        // If user do photo deletion on existing tour, then we will delete the photo objects in bucket
        if (fieldsChanged.includes("photos") && payload.photos) {
          const photosToDelete: { id: string; location: string }[] =
            defaultInputValue.photos.filter(
              (initialLoadedPhoto) =>
                !payload.photos!.some(
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
            tourId: payload.id,
            data,
          },
          token: getCookie(cookieKey) ?? "",
        });
      },
      onError(error) {
        console.error(error);

        toast.error("Something went wrong on update process!", {
          duration: 6000,
        });
      },
      onSuccess(data) {
        if (!data.updatetoursCollection) {
          toast.error("Tour was not updated successfully. Try again later.", {
            duration: 6000,
          });
          return;
        }

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

        toast.success("Tour has been updated successfully!", {
          duration: 6000,
        });

        if (onSuccessUpdate) {
          onSuccessUpdate(data, getChangedFields(form));
        }

        closeModal?.();
      },
    });

  const {
    data: dataToursBySlug,
    isLoading: isCheckingSlug,
    isSuccess,
  } = useQuery({
    enabled:
      isValidSlug.test(debouncedValue.value) &&
      !debouncedValue.isLoading &&
      debouncedValue.value.length > 0,
    queryFn: () =>
      requestToursCollectionByUsedSlug(
        debouncedValue.value,
        getCookie(cookieKey) ?? ""
      ),
    queryKey: ["toursBySlug", { slug: debouncedValue.value }],
    staleTime: 5 * 60 * 1000,
  });

  useUpdateEffect(() => {
    if (isSuccess && dataToursBySlug) {
      const isTaken =
        (dataToursBySlug.toursCollection?.edges.length ?? 0) > 0 &&
        (mode === "edit"
          ? dataToursBySlug.toursCollection?.edges[0].node.id !== itemID
          : true);

      setForm((prevState) => ({
        ...prevState,
        slug: { ...prevState.slug, error: isTaken ? "Slug has been used" : "" },
      }));
    }
  }, [isSuccess, dataToursBySlug, itemID, mode]);

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

  const onSave = async (
    event: BaseSyntheticEvent,
    submittedFormState: FormTour_State_Object
  ) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    let countInputsValidationFails = 0;

    for (const inputName in form) {
      if (
        form[inputName as keyof FormTour_State_Object].isRequired &&
        typeof formData.get(inputName) === "string"
      ) {
        if (
          !validateRequirementOfMandatory(formData.get(inputName) as string)
        ) {
          submittedFormState[inputName as keyof FormTour_State_Object].error =
            "This field is required";
          countInputsValidationFails = countInputsValidationFails + 1;
        } else {
          if (inputName !== "slug") {
            submittedFormState[inputName as keyof FormTour_State_Object].error =
              "";
          }

          if (inputName === "slug") {
            if (!isValidSlug.test(formData.get(inputName) as string)) {
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

    const fieldsChanged = getChangedFields(form);

    if (mode === "add") {
      mutateCreateTour({
        name: formData.get("name"),
        slug: formData.get("slug"),
        availability: formData.get("availability"),
        capacity: formData.get("capacity"),
        city: formData.get("city"),
        description: formData.get("description"),
        price: formData.get("price"),
        photosToUpload: submittedFormState.photosToUpload.value,
        publish: formData.get("publish"),
      });
    } else {
      mutateUpdateTour({
        payload: {
          id: itemID as string,
          name: fieldsChanged.includes("name")
            ? (formData.get("name") as string)
            : undefined,
          slug: fieldsChanged.includes("slug")
            ? (formData.get("slug") as string)
            : undefined,
          availability: fieldsChanged.includes("availability")
            ? Number(formData.get("availability"))
            : undefined,
          capacity: fieldsChanged.includes("capacity")
            ? Number(formData.get("capacity"))
            : undefined,
          city: fieldsChanged.includes("city")
            ? (formData.get("city") as string)
            : undefined,
          description: fieldsChanged.includes("description")
            ? (formData.get("description") as string)
            : undefined,
          price: fieldsChanged.includes("price")
            ? Number(formData.get("price"))
            : undefined,
          photos: fieldsChanged.includes("photos")
            ? form.photos.value
            : undefined,
          photosToUpload:
            form.photosToUpload.value.length > 0
              ? { bucket: "tours", data: form.photosToUpload.value }
              : undefined,
          is_published: fieldsChanged.includes("publish")
            ? Boolean(formData.get("publish"))
            : undefined,
        },
        fieldsChanged,
      });
    }
  };

  const textButtonSave = mode === "add" ? "Create Tour" : "Save changes";

  const isLoadingSlug = debouncedValue.isLoading || isCheckingSlug;
  // Only show status icons if the slug has a value and is in a valid format.
  const showStatusIcon =
    form.slug.value.length > 0 && isValidSlug.test(form.slug.value);

  // Slug is available if the check was successful and there's no "taken" error.
  const isSlugAvailable = showStatusIcon && isSuccess && form.slug.error === "";

  // The slug is taken if the specific error is present.
  const isSlugTaken =
    showStatusIcon && form.slug.error === "Slug has been used";

  return (
    <Form onSubmit={(e) => onSave(e, { ...form })} type={type}>
      <ContainerModalContentOverflowYScroll $height={70}>
        <FormGrid>
          {/* ═══ SECTION 1: GENERAL INFORMATION ═══ */}
          <Section $span={2}>
            <SectionHeader>
              <SectionIcon>
                <DocumentTextIcon />
              </SectionIcon>
              <SectionTitle>General Information</SectionTitle>
            </SectionHeader>

            <FieldGroup>
              <RowFormVertical error={form.name.error}>
                <FloatingInput
                  disabled={isPendingOnCreateTour || isPendingOnUpdateTour}
                  label="Tour Name *"
                  name="name"
                  onBlur={(e) => {
                    if (validateRequirementOfMandatory(e.target.value)) return;

                    setForm((prevState) => ({
                      ...prevState,
                      name: {
                        ...prevState.name,
                        error: "This field is required",
                      },
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
              </RowFormVertical>

              <RowFormVertical error={form.slug.error}>
                <div>
                  <InputWrapper>
                    <FloatingInput
                      disabled={isPendingOnCreateTour || isPendingOnUpdateTour}
                      label="URL Slug *"
                      name="slug"
                      onBlur={(e) => {
                        if (validateRequirementOfMandatory(e.target.value))
                          return;

                        setForm((prevState) => ({
                          ...prevState,
                          slug: {
                            ...prevState.slug,
                            error: "This field is required",
                          },
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
                            ...prevState.slug,
                            error,
                            value: slug,
                          },
                        }));
                      }}
                      type="text"
                      value={form.slug.value}
                    />
                    <InputIconWrapper>
                      {isLoadingSlug && (
                        <SpinnerMini height="2rem" width="2rem" />
                      )}
                      {!isLoadingSlug && isSlugAvailable && (
                        <CheckCircleIcon
                          style={{ color: "var(--color-green-700)" }}
                        />
                      )}
                      {!isLoadingSlug && isSlugTaken && (
                        <XCircleIcon
                          style={{ color: "var(--color-red-700)" }}
                        />
                      )}
                    </InputIconWrapper>
                  </InputWrapper>
                  <HelperText>
                    {isLoadingSlug
                      ? "Checking availability..."
                      : "Used in URL: /tours/" + form.slug.value}
                  </HelperText>
                </div>
              </RowFormVertical>

              <RowFormVertical error={form.city.error}>
                <FloatingInput
                  disabled={isPendingOnCreateTour || isPendingOnUpdateTour}
                  label="City / Location *"
                  name="city"
                  onBlur={(e) => {
                    if (validateRequirementOfMandatory(e.target.value)) return;

                    setForm((prevState) => ({
                      ...prevState,
                      city: {
                        ...prevState.city,
                        error: "This field is required",
                      },
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
              </RowFormVertical>
            </FieldGroup>
          </Section>

          <Divider />

          {/* ═══ SECTION 2: LOGISTICS ═══ */}
          <Section>
            <SectionHeader>
              <SectionIcon>
                <CubeIcon />
              </SectionIcon>
              <SectionTitle>Logistics</SectionTitle>
            </SectionHeader>

            <FieldGroup>
              <RowFormVertical error={form.price.error}>
                <FloatingInput
                  disabled={isPendingOnCreateTour || isPendingOnUpdateTour}
                  label="Price (Rp)"
                  min={0}
                  name="price"
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      price: {
                        ...prevState.price,
                        value: Number(e.target.value),
                      },
                    }))
                  }
                  type="number"
                  value={form.price.value.toString()}
                />
              </RowFormVertical>

              <RowFormVertical error={form.capacity.error}>
                <div>
                  <FloatingInput
                    disabled={isPendingOnCreateTour || isPendingOnUpdateTour}
                    min={0}
                    label="Max Capacity"
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
                  <HelperText>Maximum number of participants</HelperText>
                </div>
              </RowFormVertical>

              <RowFormVertical error={form.availability.error}>
                <div>
                  <FloatingInput
                    disabled={isPendingOnCreateTour || isPendingOnUpdateTour}
                    label="Available Spots"
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
                  <HelperText>Current available bookings</HelperText>
                </div>
              </RowFormVertical>
            </FieldGroup>
          </Section>

          {/* ═══ SECTION 3: CONTENT ═══ */}
          <Section>
            <SectionHeader>
              <SectionIcon>
                <ChatBubbleBottomCenterTextIcon />
              </SectionIcon>
              <SectionTitle>Content</SectionTitle>
            </SectionHeader>

            <FieldGroup>
              <RowFormVertical error={form.description.error}>
                <FloatingTextarea
                  disabled={isPendingOnCreateTour || isPendingOnUpdateTour}
                  helperText="Describe the tour experience, highlights, and what makes it special"
                  label="Description"
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
                  rows={8}
                  value={form.description.value}
                />
              </RowFormVertical>
            </FieldGroup>
          </Section>

          <Divider />

          {/* ═══ SECTION 4: MEDIA ═══ */}
          <Section $span={2}>
            <SectionHeader>
              <SectionIcon>
                <PhotoIcon />
              </SectionIcon>
              <SectionTitle>Photos & Media</SectionTitle>
            </SectionHeader>

            {mode === "edit" && form.photos.value.length > 0 && (
              <div>
                <HelperText style={{ marginTop: 0, marginBottom: "1.6rem" }}>
                  Current Photos (click ✕ to remove):
                </HelperText>
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
              </div>
            )}

            <PhotoUploadSection>
              <HelperText style={{ margin: 0 }}>
                Upload new photos (.jpg, .jpeg, .webp):
              </HelperText>
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
                        value: [
                          ...newState.photosToUpload.value,
                          ...selectedFiles,
                        ],
                      },
                    };
                  });

                  e.target.value = "";
                }}
              />
            </PhotoUploadSection>

            {form.photosToUpload.value.length > 0 && (
              <div>
                <HelperText style={{ marginTop: 0, marginBottom: "1.6rem" }}>
                  Photos to Upload:
                </HelperText>
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
              </div>
            )}
          </Section>

          <Divider />

          {/* ═══ SECTION 5: PUBLISHING ═══ */}
          <Section $span={2}>
            <SectionHeader>
              <SectionIcon>
                <CheckCircleIcon />
              </SectionIcon>
              <SectionTitle>Publishing</SectionTitle>
            </SectionHeader>

            <PublishToggleContainer>
              <PublishLabel>
                <span className="icon">
                  <CheckCircleIcon />
                </span>
                <span className="text">
                  <span className="title">Publish Tour</span>
                  <span className="description">
                    Make this tour visible to users
                  </span>
                </span>
              </PublishLabel>

              <ToggleSwitch
                defaultChecked={defaultInputValue?.publish}
                height={24}
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
            </PublishToggleContainer>
          </Section>
        </FormGrid>
      </ContainerModalContentOverflowYScroll>

      <ActionsFooter>
        <Button
          $size="small"
          $variation="secondary"
          disabled={isPendingOnCreateTour || isPendingOnUpdateTour}
          onClick={() => closeModal?.()}
          type="button"
        >
          Cancel
        </Button>

        <Button
          $flex={{ alignItems: "center", gap: "0.8rem" }}
          $size="small"
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
              <SpinnerMini height={"2rem"} width={"2rem"} />
              <span>Saving...</span>
            </>
          ) : (
            <span>{textButtonSave}</span>
          )}
        </Button>
      </ActionsFooter>
    </Form>
  );
};

export default FormTour;
