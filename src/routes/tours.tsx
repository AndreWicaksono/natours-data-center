import { FileRoute } from "@tanstack/react-router";

import TemplatePageTours from "src/components/Templates/routes/tours";

export const route = new FileRoute("/tours").createRoute({
  component: () => <TemplatePageTours />,
});
