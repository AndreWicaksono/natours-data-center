import { Outlet, RootRoute } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import App from "src/App";

export const route = new RootRoute({
  component: () => (
    <App>
      <Outlet />
    </App>
  ),
});
