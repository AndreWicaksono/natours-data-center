import { FileRoute, Navigate } from "@tanstack/react-router";

export const route = new FileRoute("/").createRoute({
  component: () => {
    return <Navigate replace to="/login" />;
  },
});
