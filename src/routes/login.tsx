import { FileRoute, Navigate } from "@tanstack/react-router";

import Spinner from "src/components/Atoms/Spinner";
import { FullPage } from "src/components/Templates/ProtectedRoute";
import TemplatePageLogin from "src/components/Templates/routes/login";

import { useVerifyAuth } from "src/hooks/useVerifyAuth";

export const route = new FileRoute("/login").createRoute({
  beforeLoad: async () => {},
  component: () => {
    /* eslint-disable react-hooks/rules-of-hooks */
    const { data, isLoading } = useVerifyAuth();

    // 1. Check if authenticated first to trigger navigation immediately
    if (data && data.isAuthenticated) {
      return <Navigate replace to="/dashboard" />;
    }

    // 2. Show spinner while verifying (data object is always returned by your hook, so !data was always false)
    if (isLoading)
      return (
        <FullPage>
          <Spinner />
        </FullPage>
      );

    return <TemplatePageLogin />;
  },
});
