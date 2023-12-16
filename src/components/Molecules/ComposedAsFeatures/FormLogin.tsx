import {
  BaseSyntheticEvent,
  DetailedHTMLProps,
  FC,
  FormHTMLAttributes,
  useState,
} from "react";

import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";

import Button from "src/components/Atoms/Button";
import Input from "src/components/Atoms/FormInput/Input";
import SpinnerMini from "src/components/Atoms/SpinnerMini";
import Form from "src/components/Molecules/Form/Form";
import RowFormVertical from "src/components/Molecules/Form/RowFormVertical";

import { requestLogin } from "src/API/REST/POST/Auth";
import { cookieKey } from "src/Global/Constants";
import useClientCookie from "src/hooks/useClientCookie";
import { isValidEmail } from "src/utils/RegExp";

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
  const [account, setAccount] = useState<{
    email: { error: string; value: string };
    password: { error: string; value: string };
  }>({ email: { error: "", value: "" }, password: { error: "", value: "" } });

  const { setCookie } = useClientCookie();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    gcTime: 0,
    mutationFn: requestLogin,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      const authInfo = {
        created_at: response.user.created_at,
        email: response.user.email,
        id: response.user.id,
      };

      queryClient.setQueryData(["auth"], authInfo);

      setCookie({
        cookieExpires: new Date(
          dayjs().add(response.expires_in, "seconds").format()
        ).toUTCString(),
        cookieKey,
        cookiePath: "/",
        cookieValue: response.access_token,
      });

      navigate({ replace: true, to: "/dashboard" });
    },
  });

  const validateEmail = (
    emailAddress: string
  ): { isError: boolean; message: string } => {
    if (isValidEmail.test(emailAddress)) {
      return {
        isError: false,
        message: "",
      };
    }

    return {
      isError: true,
      message: "Please fill with valid email address",
    };
  };

  const validatePassword = (
    password: string
  ): { isError: boolean; message: string } => {
    if (password.length === 0) {
      return {
        isError: true,
        message: "Password field cannot be blank",
      };
    }

    return {
      isError: false,
      message: "",
    };
  };

  function handleSubmit(e: BaseSyntheticEvent) {
    e.preventDefault();

    const emailValidationResult = validateEmail(e.currentTarget[0]["value"]);
    const passwordValidationResult = validatePassword(
      e.currentTarget[1]["value"]
    );

    if (emailValidationResult.isError || passwordValidationResult.isError) {
      setAccount((prevState) => {
        return {
          email: {
            ...prevState.email,
            error: emailValidationResult.message,
          },
          password: {
            ...prevState.password,
            error: passwordValidationResult.message,
          },
        };
      });

      return;
    }

    mutate({ email: account.email.value, password: account.password.value });
  }

  return (
    <>
      <Form
        $boxShadow={boxShadow}
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <RowFormVertical error={account.email.error} label="Email address">
          <Input
            id="email"
            autoComplete="username"
            disabled={isPending}
            onBlur={(e) => {
              const emailValidationResult = validateEmail(e.target.value);

              if (!emailValidationResult.isError) return;

              setAccount((prevState) => {
                return {
                  ...prevState,
                  email: {
                    ...prevState.email,
                    error: emailValidationResult.message,
                  },
                };
              });
            }}
            onChange={(e) => {
              e.preventDefault();
              const emailValidationResult = validateEmail(e.target.value);

              setAccount((prevState) => {
                return {
                  ...prevState,
                  email: {
                    error:
                      prevState.email.error && emailValidationResult.message,
                    value: e.target.value,
                  },
                };
              });
            }}
            type="email"
            value={account.email.value}
          />
        </RowFormVertical>

        <RowFormVertical error={account.password.error} label="Password">
          <Input
            id="password"
            autoComplete="current-password"
            disabled={isPending}
            onBlur={(e) => {
              const passwordValidationResult = validatePassword(e.target.value);

              if (!passwordValidationResult.isError) return;

              if (passwordValidationResult.isError) {
                setAccount((prevState) => {
                  return {
                    ...prevState,
                    password: {
                      ...prevState.password,
                      error: passwordValidationResult.message,
                    },
                  };
                });
              }
            }}
            onChange={(e) => {
              e.preventDefault();
              const passwordValidationResult = validatePassword(e.target.value);

              setAccount((prevState) => {
                return {
                  ...account,
                  password: {
                    error:
                      prevState.password.error &&
                      passwordValidationResult.message,
                    value: e.target.value,
                  },
                };
              });
            }}
            type="password"
            value={account.password.value}
          />
        </RowFormVertical>

        <RowFormVertical>
          <Button
            $flex={{
              alignItems: "center",
              justifyContent: "center",
              gap: ".8rem",
            }}
            $size="large"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <>
                <SpinnerMini />

                <span>Authenticating</span>
              </>
            ) : (
              <span>Log in</span>
            )}
          </Button>
        </RowFormVertical>
      </Form>
    </>
  );
};

export default FormLogin;
