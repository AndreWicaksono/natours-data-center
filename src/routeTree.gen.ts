import { route as routeRoot } from "src/routes/__root";
import { route as routeIndex } from "src/routes/index";
import { route as routeLogin } from "src/routes/login";

import { route as routeAppLayout } from "src/routes/_applayout";
import { route as routeAppIndex } from "src/routes/dashboard";
import { route as routeAppTours } from "src/routes/tours";

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      parentRoute: typeof routeRoot;
    };
    "/login": {
      parentRoute: typeof routeRoot;
    };
    "/_applayout": {
      parentRoute: typeof routeRoot;
    };
    "/dashboard": {
      parentRoute: typeof routeAppLayout;
    };
    "/tours": {
      parentRoute: typeof routeAppLayout;
    };
  }
}

Object.assign(routeIndex.options, {
  path: "/",
  getParentRoute: () => routeRoot,
});

Object.assign(routeLogin.options, {
  path: "/login",
  getParentRoute: () => routeRoot,
});

Object.assign(routeAppLayout.options, {
  id: "/layout",
  getParentRoute: () => routeRoot,
});

Object.assign(routeAppIndex.options, {
  path: "/dashboard",
  getParentRoute: () => routeAppLayout,
});

Object.assign(routeAppTours.options, {
  path: "/tours",
  getParentRoute: () => routeAppLayout,
});

export const routeTree = routeRoot.addChildren([
  routeIndex,
  routeLogin,
  routeAppLayout.addChildren([routeAppIndex, routeAppTours]),
]);
