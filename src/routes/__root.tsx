import { Outlet, RootRoute } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import App from "src/App";

import { Toast } from "src/components/Molecules/Toast";

export const route = new RootRoute({
  component: () => (
    <App>
      <Outlet />

      <Toast />
    </App>
  ),
});
