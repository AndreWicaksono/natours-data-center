import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const route = new FileRoute("/dashboard").createRoute({
  component: lazyRouteComponent(
    () => import("src/components/Organisms/Charts/RevenueTrendChart"),
    "RevenueTrendChart"
  ),
});
