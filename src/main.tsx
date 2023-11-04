import ReactDOM from "react-dom/client";

import { RouterProvider, Router } from "@tanstack/react-router";

import { routeTree } from "src/routeTree.gen";

// Set up a Router instance
const router = new Router({
  defaultPreload: "intent",
  routeTree,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;

const root = ReactDOM.createRoot(rootElement);
root.render(<RouterProvider router={router} />);
