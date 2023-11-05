import { FileRoute, Navigate } from "@tanstack/react-router";

import { FullPage } from "src/components/Templates/ProtectedRoute";
import Spinner from "src/components/Atoms/Spinner";

import TemplatePageLogin from "src/components/Templates/TemplatePageLogin";

import { useVerifyAuth } from "src/hooks/useVerifyAuth";

export const route = new FileRoute("/login").createRoute({
  beforeLoad: async () => {},
  component: () => {
    /* eslint-disable react-hooks/rules-of-hooks */
    const { data, isLoading } = useVerifyAuth();

    if (isLoading)
      return (
        <FullPage>
          <Spinner />
        </FullPage>
      );

    if (data.isAuthenticated && !isLoading) {
      return <Navigate replace to="/dashboard" />;
    }

    return <TemplatePageLogin />;
  },
});
