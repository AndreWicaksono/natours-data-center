import {
  DetailedHTMLProps,
  FC,
  FormEvent,
  FormHTMLAttributes,
  useState,
} from "react";

import Button from "src/components/Atoms/Button";
import Input from "src/components/Atoms/Input";
import SpinnerMini from "src/components/Atoms/SpinnerMini";
import Form from "src/components/Molecules/Form/Form";
import RowFormVertical from "src/components/Molecules/Form/RowFormVertical";

const FormLogin: FC<
  DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    boxShadow?:
      | "shadow"
      | "shadow-sm"
      | "shadow-md"
      | "shadow-lg"
      | "shadow-xl"
      | "shadow-2xl"
      | "shadow-inner";
  }
> = ({ boxShadow }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLoading = false;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email || !password) return;
  }

  return (
    <Form onSubmit={handleSubmit} $boxShadow={boxShadow}>
      <RowFormVertical label="Email address">
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </RowFormVertical>

      <RowFormVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </RowFormVertical>

      <RowFormVertical>
        <Button $size="large" disabled={isLoading}>
          {!isLoading ? "Log in" : <SpinnerMini />}
        </Button>
      </RowFormVertical>
    </Form>
  );
};

export default FormLogin;
