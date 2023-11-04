import { FileRoute } from "@tanstack/router-core";

import ProtectedRoute from "src/components/Templates/ProtectedRoute";
import TemplateApp from "src/components/Templates/TemplateApp";

export const route = new FileRoute("/_applayout").createRoute({
  component: () => {
    return (
      <ProtectedRoute>
        <TemplateApp />
      </ProtectedRoute>
    );
  },
});
