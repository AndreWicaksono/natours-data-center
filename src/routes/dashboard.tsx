import { FileRoute } from "@tanstack/react-router";

export const route = new FileRoute("/dashboard").createRoute({
  component: () => {
    return <h3>Home</h3>;
  },
});
