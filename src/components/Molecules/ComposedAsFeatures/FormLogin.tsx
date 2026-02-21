import {
  BaseSyntheticEvent,
  DetailedHTMLProps,
  FC,
  FormHTMLAttributes,
  useState,
} from "react";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import styled, { keyframes } from "styled-components";

import Button from "src/components/Atoms/Button";
import FloatingInput from "src/components/Atoms/FormInput/FloatingInput";
import SpinnerMini from "src/components/Atoms/SpinnerMini";
import Form from "src/components/Molecules/Form/Form";
import RowFormVertical from "src/components/Molecules/Form/RowFormVertical";

import { requestLogin } from "src/API/REST/POST/Auth";
import { cookieKey } from "src/Global/Constants";
import useClientCookie from "src/hooks/useClientCookie";
import { isValidEmail } from "src/utils/RegExp";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// ─── Form Container ───────────────────────────────────────────────────────────

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;

  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    gap: 2rem;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ─── Welcome Section ──────────────────────────────────────────────────────────

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 1.6rem;

  animation: ${slideIn} 0.5s ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const WelcomeTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--color-grey-900);
  margin: 0 0 0.8rem 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.4rem;
  }

  @media (max-width: 480px) {
    font-size: 2.2rem;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.5rem;
  color: var(--color-grey-600);
  margin: 0;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

// ─── Password Toggle Button ───────────────────────────────────────────────────

const PasswordToggleButton = styled.button`
  position: absolute;
  right: 1.4rem;
  top: 50%;
  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  width: 3.6rem;
  height: 3.6rem;

  background: transparent;
  border: none;
  border-radius: 0.8rem;

  color: var(--color-grey-500);
  cursor: pointer;

  transition: all 0.2s ease;

  svg {
    width: 2rem;
    height: 2rem;
  }

  &:hover {
    background: var(--color-grey-100);
    color: var(--color-grey-700);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  @media (max-width: 768px) {
    width: 4rem;
    height: 4rem;
    right: 1.6rem;

    svg {
      width: 2.2rem;
      height: 2.2rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      background 0.2s ease,
      color 0.2s ease;

    &:active {
      transform: translateY(-50%);
    }
  }
`;

// ─── Input Wrapper (for password toggle positioning) ─────────────────────────

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

// ─── Main Form Component ──────────────────────────────────────────────────────

const FormLogin: FC<
  DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    boxShadow?: boolean;
  }
> = ({ boxShadow }) => {
  const [account, setAccount] = useState<{
    email: { error: string; value: string };
    password: { error: string; value: string };
  }>({
    email: { error: "", value: "" },
    password: { error: "", value: "" },
  });

  const [showPassword, setShowPassword] = useState(false);

  const { setCookie } = useClientCookie();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    gcTime: 0,
    mutationFn: requestLogin,
    onError: (error) => {
      toast.error(error.message, {
        duration: 5000,
        position: "top-center",
      });
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

      toast.success("Welcome back! Redirecting to dashboard...", {
        duration: 2000,
        position: "top-center",
      });

      // Small delay for better UX
      setTimeout(() => {
        navigate({ replace: true, to: "/dashboard" });
      }, 500);
    },
  });

  const validateEmail = (
    emailAddress: string
  ): { isError: boolean; message: string } => {
    if (!emailAddress || emailAddress.trim().length === 0) {
      return {
        isError: true,
        message: "Email is required",
      };
    }

    if (!isValidEmail.test(emailAddress)) {
      return {
        isError: true,
        message: "Please enter a valid email address",
      };
    }

    return {
      isError: false,
      message: "",
    };
  };

  const validatePassword = (
    password: string
  ): { isError: boolean; message: string } => {
    if (!password || password.length === 0) {
      return {
        isError: true,
        message: "Password is required",
      };
    }

    if (password.length < 6) {
      return {
        isError: true,
        message: "Password must be at least 6 characters",
      };
    }

    return {
      isError: false,
      message: "",
    };
  };

  function handleSubmit(e: BaseSyntheticEvent) {
    e.preventDefault();

    const emailValidationResult = validateEmail(account.email.value);
    const passwordValidationResult = validatePassword(account.password.value);

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

    mutate({
      email: account.email.value.trim(),
      password: account.password.value,
    });
  }

  return (
    <FormContainer>
      <WelcomeSection>
        <WelcomeTitle>Dashboard Login</WelcomeTitle>
        <WelcomeSubtitle>Access your tour management system</WelcomeSubtitle>
      </WelcomeSection>

      <Form
        boxShadow={boxShadow}
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <RowFormVertical error={account.email.error}>
          <FloatingInput
            id="email"
            label="Email Address"
            autoComplete="username"
            disabled={isPending}
            onBlur={(e) => {
              const emailValidationResult = validateEmail(e.target.value);

              if (!emailValidationResult.isError) {
                setAccount((prevState) => ({
                  ...prevState,
                  email: { ...prevState.email, error: "" },
                }));
                return;
              }

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

        <RowFormVertical error={account.password.error}>
          <InputWrapper>
            <FloatingInput
              id="password"
              label="Password"
              autoComplete="current-password"
              disabled={isPending}
              onBlur={(e) => {
                const passwordValidationResult = validatePassword(
                  e.target.value
                );

                if (!passwordValidationResult.isError) {
                  setAccount((prevState) => ({
                    ...prevState,
                    password: { ...prevState.password, error: "" },
                  }));
                  return;
                }

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
                const passwordValidationResult = validatePassword(
                  e.target.value
                );

                setAccount((prevState) => {
                  return {
                    ...prevState,
                    password: {
                      error:
                        prevState.password.error &&
                        passwordValidationResult.message,
                      value: e.target.value,
                    },
                  };
                });
              }}
              type={showPassword ? "text" : "password"}
              value={account.password.value}
            />

            <PasswordToggleButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isPending}
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </PasswordToggleButton>
          </InputWrapper>
        </RowFormVertical>

        <RowFormVertical>
          <Button
            $flex={{
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
            $size="large"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <>
                <SpinnerMini height="2rem" width="2rem" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </Button>
        </RowFormVertical>
      </Form>
    </FormContainer>
  );
};

export default FormLogin;
