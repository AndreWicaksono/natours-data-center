import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

// eslint-disable-next-line react-refresh/only-export-components
const TemplatePageAccount = lazyRouteComponent(
  () => import("src/components/Templates/routes/account")
);

export const route = new FileRoute("/account").createRoute({
  component: () => <TemplatePageAccount />,
});
