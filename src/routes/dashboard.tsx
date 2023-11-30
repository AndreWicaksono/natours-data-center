import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

import { mockToursSalesData } from "src/components/Molecules/ComposedAsFeatures/Charts/mockData";

// eslint-disable-next-line react-refresh/only-export-components
const ChartSales = lazyRouteComponent(
  () => import("src/components/Molecules/ComposedAsFeatures/Charts/ChartSales")
);

export const route = new FileRoute("/dashboard").createRoute({
  component: () => <ChartSales data={mockToursSalesData} />,
});
