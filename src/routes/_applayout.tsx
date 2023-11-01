import { redirect } from "@tanstack/react-router";
import { FileRoute } from "@tanstack/router-core";

import { FullPage } from "src/components/Templates/ProtectedRoute";
import TemplateApp from "src/components/Templates/TemplateApp";
import Spinner from "src/components/Atoms/Spinner";

const isAuthenticated = true;
const isLoading = false;

export const route = new FileRoute("/_applayout").createRoute({
  beforeLoad: async () => {
    if (!isAuthenticated && !isLoading)
      throw redirect({ to: "/login", replace: true });
  },
  component: () => {
    if (isLoading)
      return (
        <FullPage>
          <Spinner />
        </FullPage>
      );

    return <TemplateApp />;
  },
});
