import { Suspense } from "react";

import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

import Spinner from "src/components/Atoms/Spinner";

// eslint-disable-next-line react-refresh/only-export-components
const TemplatePageAccount = lazyRouteComponent(
  () => import("src/components/Templates/routes/account")
);

export const route = new FileRoute("/account").createRoute({
  component: () => (
    <Suspense fallback={<Spinner />}>
      <TemplatePageAccount />
    </Suspense>
  ),
});
