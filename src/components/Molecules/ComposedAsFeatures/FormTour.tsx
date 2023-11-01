import { DetailedHTMLProps, FC, FormHTMLAttributes } from "react";

import Button from "src/components/Atoms/Button";
import FileInput from "src/components/Atoms/FileInput";
import Form from "src/components/Molecules/Form/Form";
import Input from "src/components/Atoms/Input";
import RowFormHorizontal from "src/components/Molecules/Form/RowFormHorizontal";
import Textarea from "src/components/Atoms/TextArea";

const FormTour: FC<
  DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    type?: "regular" | "modal";
  }
> = ({ type = "regular" }) => {
  // function onSubmit() {

  // }

  // function onError() {
  // }

  return (
    <Form
      // onSubmit={handleSubmit(onSubmit, onError)}
      $type={type}
    >
      <RowFormHorizontal
        label="Tour name"
        //  error={errors?.name?.message}
      >
        <Input
          type="text"
          id="name"
          // disabled={isWorking}
        />
      </RowFormHorizontal>

      <RowFormHorizontal
        label="Maximum capacity"
        // error={errors?.maxCapacity?.message}
      >
        <Input
          type="number"
          id="maxCapacity"
          // disabled={isWorking}
        />
      </RowFormHorizontal>

      <RowFormHorizontal
        label="Regular price"
        // error={errors?.regularPrice?.message}
      >
        <Input
          type="number"
          id="regularPrice"
          // disabled={isWorking}
        />
      </RowFormHorizontal>

      {/* <RowFormHorizontal label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            validate: (value) =>
              value <= getValues().regularPrice ||
              "Discount should be less than regular price",
          })}
        />
      </RowFormHorizontal> */}

      <RowFormHorizontal
        label="Description for website"
        // error={errors?.description?.message}
      >
        <Textarea
          id="description"
          defaultValue=""
          // disabled={isWorking}
          // {...register("description", {
          //   required: "This field is required",
          // })}
        />
      </RowFormHorizontal>

      <RowFormHorizontal label="Tour photo">
        <FileInput id="image" accept="image/*" />
      </RowFormHorizontal>

      <RowFormHorizontal>
        {/* type is an HTML attribute! */}
        <>
          <Button
            // onClick={() => onCloseModal?.()}
            type="reset"
            $variation="secondary"
          >
            Cancel
          </Button>
          <Button
          // disabled={isWorking}
          >
            Save
            {/* {isEditSession ? "Edit tour" : "Create new tour"} */}
          </Button>
        </>
      </RowFormHorizontal>
    </Form>
  );
};

export default FormTour;
