import { FileRoute } from "@tanstack/react-router";

import TableTours from "src/components/Organisms/ComposedAsFeatures/TableTours";

import { LayoutRow } from "src/Global/Styles.css";

export const route = new FileRoute("/tours").createRoute({
  component: () => {
    return (
      <div>
        <LayoutRow type="vertical">
          <TableTours />
        </LayoutRow>
      </div>
    );
  },
});
