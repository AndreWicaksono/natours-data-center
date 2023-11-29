import { FC, ReactNode } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";
import styled from "styled-components";

import Spinner from "src/components/Atoms/Spinner";

import { cookieKey } from "src/Global/Constants";
import useClientCookie from "src/hooks/useClientCookie";
import { useVerifyAuth } from "src/hooks/useVerifyAuth";

export const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Load the authenticated user
  const { getCookie } = useClientCookie();
  const queryClient = useQueryClient();
  const { data, isLoading } = useVerifyAuth();

  const cookieAuth = getCookie(cookieKey) ?? "";

  if (!cookieAuth) {
    queryClient.clear();

    return <Navigate replace to="/login" />;
  }

  // 2. If cookie exist but there is no authenticated user, then redirect to the /login
  if (!data.isAuthenticated && !isLoading) {
    return <Navigate replace to="/login" />;
  }

  // 3. While loading, show a spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 4. If there IS a user, render the app
  if (data.isAuthenticated) return children;
};

export default ProtectedRoute;
