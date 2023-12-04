import { FC } from "react";

import dayjs from "dayjs";

import { Paragraph } from "src/components/Atoms/Paragraph";
import Form from "src/components/Molecules/Form/Form";
import RowFormHorizontal from "src/components/Molecules/Form/RowFormHorizontal";
import ProfilePicture from "src/components/Molecules/ProfilePicture";

import { useAuthContext } from "src/hooks/useAuthContext";

const FormAccount: FC = () => {
  const { authContext } = useAuthContext();

  return (
    <Form>
      <ProfilePicture
        flex={{ justifyContent: "center" }}
        imgSize={{ height: 128, width: 128 }}
        imgSrc={
          authContext.photo.location
            ? `${import.meta.env.VITE_URL_SERVER}/storage/v1/object/public/${
                authContext.photo.location
              }`
            : ""
        }
      />

      <RowFormHorizontal
        grid={{ templateColumns: "10rem 1fr 8rem" }}
        label="Full name"
      >
        <p>{`${authContext.firstName} ${authContext.lastName}`}</p>
      </RowFormHorizontal>

      <RowFormHorizontal
        grid={{ templateColumns: "10rem 1fr 8rem" }}
        label="Email"
      >
        <p>{authContext.email}</p>
      </RowFormHorizontal>

      <RowFormHorizontal
        grid={{ templateColumns: "10rem 1fr 8rem" }}
        label="Status"
      >
        <Paragraph
          $color={
            authContext.isActive
              ? "var(--color-brand-600)"
              : "var(--color-red-500"
          }
        >
          {authContext.isActive ? "Active" : "Not active"}
        </Paragraph>
      </RowFormHorizontal>

      <RowFormHorizontal
        grid={{ templateColumns: "10rem 1fr 8rem" }}
        label="Created at"
      >
        <p>{dayjs(authContext.createdAt).format("DD-MM-YYYY / HH:MM")}</p>
      </RowFormHorizontal>
    </Form>
  );
};

export default FormAccount;
