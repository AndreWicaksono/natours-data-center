import { FC } from "react";

import dayjs from "dayjs";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styled from "styled-components";

import Heading from "src/components/Atoms/Heading";

import { formatRupiah } from "src/utils/Number";

const DashboardBox = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 3.2rem;

  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

const ChartSales: FC<{
  data: Array<{ id: number; createdAt: string; price: number }>;
}> = ({ data }) => {
  const allDates: string[] = [
    "Wed Nov 29 2023 00:00:00",
    "Thu Nov 30 2023 00:00:00",
    "Fri Dec 01 2023 00:00:00",
    "Sat Dec 02 2023 00:00:00",
    "Sun Dec 03 2023 00:00:00",
  ];

  const mappedData = allDates.map((date) => {
    return {
      label: dayjs(new Date(date)).format("MMM DD"),
      totalSales: data
        .filter((booking) => dayjs(date).isSame(dayjs(booking.createdAt)))
        .reduce((acc, cur) => acc + cur.price, 0),
    };
  });

  const colors = {
    totalSales: { stroke: "#16a34a", fill: "#dcfce7" },
    text: "#374151",
    background: "#fff",
  };

  return (
    <StyledSalesChart>
      <Heading as="h2">
        Best Selling Highlight: {dayjs(allDates.at(0)).format("MMM DD YYYY")}{" "}
        &mdash; {dayjs(allDates.at(-1)).format("MMM DD YYYY")}{" "}
      </Heading>

      <ResponsiveContainer height={300} width="100%">
        <AreaChart
          data={mappedData}
          margin={{ top: 0, right: 0, left: 56, bottom: 0 }}
        >
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
            tickMargin={12}
          />

          <YAxis
            tick={{ fill: colors.text }}
            tickFormatter={(tick) => {
              return formatRupiah(tick);
            }}
            tickLine={{ stroke: colors.text }}
          />

          <CartesianGrid strokeDasharray="4" />

          <Tooltip
            contentStyle={{ backgroundColor: colors.background }}
            formatter={(value, name) => {
              if (typeof value === "number") {
                return [formatRupiah(value), name];
              }

              return [value, name];
            }}
          />

          <Area
            dataKey="totalSales"
            fill={colors.totalSales.fill}
            name="Total sales"
            type="monotone"
            stroke={colors.totalSales.stroke}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
};

export default ChartSales;
