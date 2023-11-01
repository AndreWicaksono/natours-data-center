import { FileRoute, redirect } from "@tanstack/react-router";

import { FullPage } from "src/components/Templates/ProtectedRoute";
import Spinner from "src/components/Atoms/Spinner";

import TemplatePageLogin from "src/components/Templates/TemplatePageLogin";

const isAuthenticated = true;
const isLoading = false;

export const route = new FileRoute("/login").createRoute({
  beforeLoad: async () => {
    if (isAuthenticated && !isLoading)
      throw redirect({ to: "/dashboard", replace: true });
  },
  component: () => {
    if (isLoading)
      return (
        <FullPage>
          <Spinner />
        </FullPage>
      );

    return <TemplatePageLogin />;
  },
});
