import { Suspense } from "react";

import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

import Spinner from "src/components/Atoms/Spinner";
import { mockToursSalesData } from "src/components/Molecules/ComposedAsFeatures/Charts/mockData";

// eslint-disable-next-line react-refresh/only-export-components
const ChartSales = lazyRouteComponent(
  () => import("src/components/Molecules/ComposedAsFeatures/Charts/ChartSales")
);

export const route = new FileRoute("/dashboard").createRoute({
  component: () => (
    <Suspense fallback={<Spinner />}>
      <ChartSales data={mockToursSalesData} />,
    </Suspense>
  ),
});
