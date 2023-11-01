import { FC, ReactNode, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import styled from "styled-components";

import Spinner from "src/components/Atoms/Spinner";

export const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const isLoading = false;
  const isAuthenticated = false;

  // 1. Load the authenticated user

  // 2. If there is NO authenticated user, redirect to the /login
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading)
        navigate({ to: "/login", replace: true });
    },
    [isAuthenticated, isLoading, navigate]
  );

  // 3. While loading, show a spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 4. If there IS a user, render the app
  if (isAuthenticated) return children;
};

export default ProtectedRoute;
