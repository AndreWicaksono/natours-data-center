import { FileRoute } from "@tanstack/react-router";

import ProtectedRoute from "src/components/Templates/ProtectedRoute";
import TemplateApp from "src/components/Templates/TemplateAppLayout";

export const route = new FileRoute("/_applayout").createRoute({
  component: () => {
    return (
      <ProtectedRoute>
        <TemplateApp />
      </ProtectedRoute>
    );
  },
});
