import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { ResponsiveLine } from "@nivo/line";
import styled, { css, keyframes } from "styled-components";

import { useMediaQuery } from "src/hooks/useMediaQuery";
import RevenueTrendAnalysisWorker from "../../../workers/revenueTrendAnalysis.worker?worker";

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_MASTER_YEAR = CURRENT_YEAR - 1;
const OLDEST_ALLOWED_YEAR = CURRENT_YEAR - 5;

const TODAY = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

// ─── Types ────────────────────────────────────────────────────────────────────

interface PendingRequest {
  resolve: (value: { result: LineChartSerie[]; executionTime: number }) => void;
  reject: (reason?: unknown) => void;
  startTime: number;
  timeoutId?: NodeJS.Timeout;
}

interface RevenueTrendData {
  date: string;
  revenue: number;
  bookings: number;
}

interface LineChartDatum {
  x: string;
  y: number;
}

interface LineChartSerie {
  id: string;
  data: LineChartDatum[];
}

export type TimeRange = "1W" | "1M" | "3M" | "6M" | "1Y";
export type GroupBy = "day" | "week" | "month";

interface RangeConfig {
  label: string;
  mobileGroupBy: GroupBy;
  desktopGroupBy: GroupBy;
}

const RANGE_CONFIG: Record<TimeRange, RangeConfig> = {
  "1W": { label: "1W", mobileGroupBy: "day", desktopGroupBy: "day" },
  "1M": { label: "1M", mobileGroupBy: "day", desktopGroupBy: "day" },
  "3M": { label: "3M", mobileGroupBy: "week", desktopGroupBy: "day" },
  "6M": { label: "6M", mobileGroupBy: "week", desktopGroupBy: "week" },
  "1Y": { label: "1Y", mobileGroupBy: "month", desktopGroupBy: "week" },
};

const GROUP_BY_LABEL: Record<GroupBy, string> = {
  day: "Daily",
  week: "Weekly",
  month: "Monthly",
};

function getMinOffset(range: TimeRange): number {
  switch (range) {
    case "1W":
      return -51;
    case "1M":
      return -11;
    case "3M":
      return -3;
    case "6M":
      return -1;
    case "1Y":
      return 0;
  }
}

// ─── Period Window ────────────────────────────────────────────────────────────

interface PeriodWindow {
  start: Date;
  end: Date;
  label: string;
  isPartial: boolean;
}

function computePeriodWindow(
  range: TimeRange,
  offset: number,
  masterYear: number
): PeriodWindow {
  const fmt = {
    short: (d: Date) => d.toLocaleString("en-US", { month: "short" }),
    shortDay: (d: Date) =>
      d.toLocaleString("en-US", { month: "short", day: "numeric" }),
    long: (d: Date) =>
      d.toLocaleString("en-US", { month: "long", year: "numeric" }),
  };

  let calculatedStart: Date;
  let calculatedEnd: Date;
  let baseLabel: string;

  if (range === "1Y") {
    calculatedStart = new Date(masterYear, 0, 1);
    calculatedEnd = new Date(masterYear, 11, 31);
    baseLabel = String(masterYear);
  } else if (range === "1M") {
    const targetDate = new Date(masterYear, 11 + offset, 1);
    calculatedStart = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      1
    );
    calculatedEnd = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() + 1,
      0
    );
    baseLabel = fmt.long(calculatedStart);
  } else if (range === "1W") {
    const anchorEnd = new Date(masterYear, 11, 31);
    anchorEnd.setDate(anchorEnd.getDate() + offset * 7);
    const anchorStart = new Date(anchorEnd);
    anchorStart.setDate(anchorEnd.getDate() - 6);

    calculatedStart = anchorStart;
    calculatedEnd = anchorEnd;

    const sameYear = anchorStart.getFullYear() === anchorEnd.getFullYear();
    baseLabel = sameYear
      ? `${fmt.shortDay(anchorStart)} – ${fmt.shortDay(anchorEnd)}`
      : `${fmt.shortDay(anchorStart)}, ${anchorStart.getFullYear()} – ${fmt.shortDay(anchorEnd)}, ${anchorEnd.getFullYear()}`;
  } else if (range === "3M") {
    const endMonth = 11 + offset * 3;
    calculatedEnd = new Date(masterYear, endMonth + 1, 0);
    calculatedStart = new Date(
      calculatedEnd.getFullYear(),
      calculatedEnd.getMonth() - 2,
      1
    );

    const sameYear =
      calculatedStart.getFullYear() === calculatedEnd.getFullYear();
    baseLabel = sameYear
      ? `${fmt.short(calculatedStart)} – ${fmt.short(calculatedEnd)} ${calculatedEnd.getFullYear()}`
      : `${fmt.short(calculatedStart)} ${calculatedStart.getFullYear()} – ${fmt.short(calculatedEnd)} ${calculatedEnd.getFullYear()}`;
  } else {
    const endMonth = 11 + offset * 6;
    calculatedEnd = new Date(masterYear, endMonth + 1, 0);
    calculatedStart = new Date(
      calculatedEnd.getFullYear(),
      calculatedEnd.getMonth() - 5,
      1
    );

    const sameYear =
      calculatedStart.getFullYear() === calculatedEnd.getFullYear();
    baseLabel = sameYear
      ? `${fmt.short(calculatedStart)} – ${fmt.short(calculatedEnd)} ${calculatedEnd.getFullYear()}`
      : `${fmt.short(calculatedStart)} ${calculatedStart.getFullYear()} – ${fmt.short(calculatedEnd)} ${calculatedEnd.getFullYear()}`;
  }

  const isPartial = calculatedEnd > TODAY;
  const actualEnd = isPartial ? new Date(TODAY) : calculatedEnd;

  let finalLabel = baseLabel;
  if (isPartial && calculatedStart <= TODAY) {
    if (range === "1Y") {
      finalLabel = `${baseLabel} (through ${fmt.shortDay(TODAY)})`;
    } else if (range === "1M") {
      finalLabel = `${fmt.long(calculatedStart)} (through ${fmt.shortDay(TODAY)})`;
    } else {
      finalLabel = `${baseLabel} (through ${fmt.shortDay(TODAY)})`;
    }
  }

  return {
    start: calculatedStart,
    end: actualEnd,
    label: finalLabel,
    isPartial,
  };
}

function findMostRecentValidOffset(
  range: TimeRange,
  masterYear: number
): number {
  if (masterYear < CURRENT_YEAR) {
    return 0;
  }

  if (masterYear > CURRENT_YEAR) {
    return getMinOffset(range);
  }

  let testOffset = 0;
  const minOffset = getMinOffset(range);

  while (testOffset >= minOffset) {
    const window = computePeriodWindow(range, testOffset, masterYear);

    if (window.start <= TODAY) {
      return testOffset;
    }

    testOffset--;
  }

  return minOffset;
}

function canNavigateForward(
  range: TimeRange,
  offset: number,
  masterYear: number
): boolean {
  // For 1Y view, period navigation is disabled (year selector handles it)
  if (range === "1Y") {
    return false;
  }

  if (masterYear > CURRENT_YEAR) {
    return false;
  }

  if (offset >= 0) {
    return false;
  }

  const nextPeriod = computePeriodWindow(range, offset + 1, masterYear);
  return nextPeriod.start <= TODAY;
}

// ─── Data helpers ─────────────────────────────────────────────────────────────

function getDateRangeData(
  data: RevenueTrendData[],
  start: Date,
  end: Date
): RevenueTrendData[] {
  const startStr = start.toISOString().split("T")[0];
  const endStr = end.toISOString().split("T")[0];
  return data.filter((d) => d.date >= startStr && d.date <= endStr);
}

function aggregateData(
  data: RevenueTrendData[],
  groupBy: GroupBy
): RevenueTrendData[] {
  if (groupBy === "day") return data;

  const buckets = new Map<string, RevenueTrendData[]>();

  for (const record of data) {
    const d = new Date(record.date + "T00:00:00");
    let key: string;

    if (groupBy === "week") {
      const dow = d.getDay() || 7;
      const monday = new Date(d);
      monday.setDate(d.getDate() - (dow - 1));
      key = monday.toISOString().split("T")[0];
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
    }

    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(record);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, records]) => ({
      date,
      revenue: Math.round(records.reduce((s, r) => s + r.revenue, 0)),
      bookings: records.reduce((s, r) => s + r.bookings, 0),
    }));
}

function formatAxisTick(isoDate: string, groupBy: GroupBy): string {
  const d = new Date(isoDate + "T00:00:00");
  if (groupBy === "month") return d.toLocaleString("en-US", { month: "short" });
  if (groupBy === "week")
    return d.toLocaleString("en-US", { month: "short", day: "numeric" });
  return isoDate;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

function generateMockRevenueTrend(
  startDate: string,
  endDate: string
): RevenueTrendData[] {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const cappedEnd = end > TODAY ? new Date(TODAY) : end;

  const results: RevenueTrendData[] = [];
  const cur = new Date(start);
  let day = 0;

  while (cur <= cappedEnd) {
    const revenue = Math.max(
      5000,
      10000 +
        day * 50 +
        2000 * Math.sin(day * 0.02) +
        (Math.random() - 0.5) * 3000 +
        500 * Math.sin(day * 0.9)
    );
    results.push({
      date: cur.toISOString().split("T")[0],
      revenue: Math.round(revenue),
      bookings: Math.max(
        1,
        Math.floor(8 + Math.random() * 15 + Math.sin(day * 0.05) * 3)
      ),
    });
    cur.setDate(cur.getDate() + 1);
    day++;
  }
  return results;
}

async function fetchRevenueTrend(
  startDate: string,
  endDate: string,
  groupBy: string
) {
  if (import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === "true") {
    await new Promise((r) => setTimeout(r, 800));
    return generateMockRevenueTrend(startDate, endDate);
  }
  const response = await fetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query GetRevenueTrend($startDate: String!, $endDate: String!, $groupBy: String!) {
        revenueTrend(startDate: $startDate, endDate: $endDate, groupBy: $groupBy) {
          date revenue bookings
        }
      }`,
      variables: { startDate, endDate, groupBy },
    }),
  });
  const { data } = await response.json();
  return data.revenueTrend as RevenueTrendData[];
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const t = {
  green300: "#7ed56f",
  green400: "#55c57a",
  green500: "#28b485",
  green600: "#228b66",
  green700: "#1a6b4e",
  blueBase: "#00b4d8",
  blueDark: "#0077b6",
  white: "#ffffff",
  neutral50: "#fbfbfb",
  neutral100: "#f8f8f8",
  neutral200: "#f2f2f2",
  neutral500: "#b3b3b3",
  neutral600: "#7a7a7a",
  neutral800: "#333333",
  neutral900: "#1c1c1c",
  slate50: "#f8fafc",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate500: "#64748b",
  slate600: "#475569",
  successLight: "#e6f7f0",
  successBase: "#22bb33",
  successDark: "#1b8a29",
  warningLight: "#fff8e1",
  warningBase: "#f0ad4e",
  warningDark: "#b8843b",
  dangerBase: "#bb2124",
  rMd: "0.6rem",
  rLg: "1.2rem",
  rXl: "1.6rem",
  rFull: "9999px",
  shSm: "0 1px 2px rgba(0,0,0,0.05)",
  shMd: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
  shLg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
  font: `"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
};

const bp = {
  mobile: "@media (max-width: 768px)",
  small: "@media (max-width: 480px)",
};

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0);    }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1;   }
  50%      { opacity: 0.4; }
`;

// ─── Styled Components ────────────────────────────────────────────────────────

const ChartContainer = styled.div`
  background: ${t.white};
  border-radius: ${t.rXl};
  padding: 2.4rem;
  box-shadow: ${t.shMd};
  margin-bottom: 1.6rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${t.shLg};
  }
  ${bp.mobile} {
    padding: 1.6rem 1.4rem;
    border-radius: ${t.rLg};
    &:hover {
      transform: none;
      box-shadow: ${t.shMd};
    }
  }
  ${bp.small} {
    padding: 1.4rem 1.2rem;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow 0.3s ease;
    &:hover {
      transform: none;
    }
  }
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.6rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid ${t.slate200};
  gap: 1.2rem;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const ChartTitle = styled.h3`
  font-size: 2.4rem;
  line-height: 1.2;
  font-weight: 700;
  color: ${t.neutral900};
  letter-spacing: -0.02em;
  margin: 0;
  font-family: ${t.font};
  ${bp.mobile} {
    font-size: 1.8rem;
  }
  ${bp.small} {
    font-size: 1.6rem;
  }
`;

const ChartSubtitle = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  color: ${t.slate500};
  margin: 0;
  font-family: ${t.font};
  ${bp.mobile} {
    font-size: 1.3rem;
  }
  ${bp.small} {
    display: none;
  }
`;

const WorkerStatusPill = styled.div<{ $ready: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: ${t.rFull};
  font-size: 1.1rem;
  font-weight: 600;
  font-family: ${t.font};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  background: ${(p) => (p.$ready ? t.successLight : t.slate100)};
  color: ${(p) => (p.$ready ? t.successDark : t.slate500)};
  border: 1px solid ${(p) => (p.$ready ? "rgba(34,187,51,0.2)" : t.slate200)};
  transition: all 0.25s ease;
  &::before {
    content: "";
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background: ${(p) => (p.$ready ? t.successBase : t.slate500)};
    ${(p) =>
      p.$ready &&
      css`
        animation: ${pulse} 2s ease infinite;
      `}
  }
  ${bp.small} {
    display: none;
  }
`;

// ─── Year Selector (New) ──────────────────────────────────────────────────────

const YearSelectorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.6rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid ${t.slate100};

  ${bp.mobile} {
    gap: 0.8rem;
    margin-bottom: 1.2rem;
    padding-bottom: 1rem;
  }
`;

const YearLabel = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${t.slate600};
  font-family: ${t.font};
  text-transform: uppercase;
  letter-spacing: 0.04em;

  ${bp.mobile} {
    font-size: 1.2rem;
  }
  ${bp.small} {
    display: none;
  }
`;

const YearSelector = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 1.2rem;
  background: ${t.slate50};
  border: 1px solid ${t.slate200};
  border-radius: ${t.rMd};
  transition: all 0.2s ease;

  &:hover {
    background: ${t.white};
    border-color: ${t.green500};
    box-shadow: ${t.shSm};
  }

  ${bp.mobile} {
    padding: 0.5rem 1rem;
    gap: 0.6rem;
  }
`;

const YearArrow = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border: none;
  border-radius: ${t.rMd};
  background: transparent;
  color: ${t.slate500};
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: ${t.successLight};
    color: ${t.green600};
    transform: scale(1.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  ${bp.mobile} {
    width: 2rem;
    height: 2rem;
    font-size: 1.2rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      background 0.2s ease,
      color 0.2s ease;
    &:hover:not(:disabled) {
      transform: none;
    }
    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

const YearDisplay = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${t.neutral900};
  font-family: ${t.font};
  min-width: 5rem;
  text-align: center;
  user-select: none;

  ${bp.mobile} {
    font-size: 1.4rem;
    min-width: 4.5rem;
  }
`;

// ─── Time Range + Period Navigator ───────────────────────────────────────────

const TimeNavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  margin-bottom: 1.4rem;
  flex-wrap: wrap;

  ${bp.mobile} {
    gap: 0.8rem;
    margin-bottom: 1.2rem;
  }
`;

const TimeRangePills = styled.div`
  display: inline-flex;
  background: ${t.slate100};
  border-radius: ${t.rFull};
  padding: 0.4rem;
  gap: 0.3rem;
`;

const TimeRangeTab = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.4rem;
  min-height: 3.2rem;
  min-width: 4rem;
  font-family: ${t.font};
  font-size: 1.3rem;
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  border: none;
  border-radius: ${t.rFull};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  user-select: none;
  background: ${(p) => (p.$active ? t.green500 : "transparent")};
  color: ${(p) => (p.$active ? t.white : t.slate500)};
  box-shadow: ${(p) => (p.$active ? t.shSm : "none")};
  &:hover:not(:disabled) {
    background: ${(p) => (p.$active ? t.green400 : t.successLight)};
    color: ${(p) => (p.$active ? t.white : t.green500)};
    transform: scale(1.02);
  }
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  &:focus-visible {
    outline: 2px solid ${t.green500};
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  ${bp.small} {
    padding: 0.4rem 1rem;
    font-size: 1.2rem;
    min-width: 3.2rem;
  }
  @media (prefers-reduced-motion: reduce) {
    transition:
      background 0.2s ease,
      color 0.2s ease;
    &:hover:not(:disabled) {
      transform: none;
    }
    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

const PeriodNav = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
`;

const NavArrow = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  height: 2.8rem;
  border: 1px solid ${t.slate200};
  border-radius: ${t.rMd};
  background: ${t.white};
  color: ${t.slate500};
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  &:hover:not(:disabled) {
    background: ${t.successLight};
    border-color: ${t.green500};
    color: ${t.green600};
    transform: scale(1.05);
  }
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
  &:focus-visible {
    outline: 2px solid ${t.green500};
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  ${bp.small} {
    width: 2.4rem;
    height: 2.4rem;
    font-size: 1.2rem;
  }
  @media (prefers-reduced-motion: reduce) {
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease;
    &:hover:not(:disabled) {
      transform: none;
    }
    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

const PeriodLabel = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${t.neutral800};
  font-family: ${t.font};
  min-width: 14rem;
  text-align: center;
  ${bp.small} {
    font-size: 1.2rem;
    min-width: 12rem;
  }
`;

const GranularityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: ${t.slate500};
  font-family: ${t.font};
  white-space: nowrap;
  &::before {
    content: "·";
    font-size: 1.6rem;
    line-height: 1;
    color: ${t.green500};
  }
  ${bp.small} {
    font-size: 1.1rem;
  }
`;

const DataPointCount = styled.span`
  color: ${t.neutral500};
  font-weight: 400;
  ${bp.mobile} {
    display: none;
  }
`;

const ChartWrapper = styled.div`
  height: 400px;
  position: relative;
  overflow: visible;
  ${bp.mobile} {
    height: 280px;
  }
  ${bp.small} {
    height: 240px;
  }
`;

const OptimizedChartWrapper = styled.div`
  height: 400px;
  position: relative;
  overflow: visible;
  transform: translateZ(0);
  will-change: transform;
  ${bp.mobile} {
    height: 280px;
  }
  ${bp.small} {
    height: 240px;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(4px);
  z-index: 1;
  pointer-events: none;
  border-radius: ${t.rLg};
  animation: ${fadeSlideUp} 0.3s ease-out;
`;

const LoadingContent = styled.div`
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.6rem;
`;

const Spinner = styled.div`
  width: 4.8rem;
  height: 4.8rem;
  border: 0.4rem solid ${t.slate200};
  border-top-color: ${t.green500};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  ${bp.mobile} {
    width: 3.6rem;
    height: 3.6rem;
    border-width: 0.3rem;
  }
`;

const LoadingText = styled.p`
  margin-top: 1.6rem;
  font-size: 1.6rem;
  line-height: 1.6;
  color: ${t.slate500};
  text-align: center;
  font-weight: 500;
  ${bp.mobile} {
    font-size: 1.4rem;
    margin-top: 1.2rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 3.2rem;
  text-align: center;
  color: ${t.slate500};
  h4 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 0.8rem;
    color: ${t.neutral800};
  }
  p {
    font-size: 1.5rem;
    line-height: 1.6;
  }
  ${bp.mobile} {
    padding: 2.4rem 1.6rem;
    h4 {
      font-size: 1.6rem;
    }
    p {
      font-size: 1.4rem;
    }
  }
`;

const ErrorContainer = styled.div`
  padding: 2.4rem;
  text-align: center;
  color: ${t.dangerBase};
  font-size: 1.5rem;
  h4 {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }
  ${bp.mobile} {
    padding: 1.6rem;
    font-size: 1.4rem;
    h4 {
      font-size: 1.6rem;
    }
  }
`;

const LegendContainer = styled.div`
  margin-top: 2.4rem;
  padding: 1.6rem;
  background: ${t.slate50};
  border-radius: ${t.rLg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2.4rem;
  ${bp.mobile} {
    grid-template-columns: 1fr;
    gap: 1.4rem;
    padding: 1.2rem;
    margin-top: 1.6rem;
  }
`;

const LegendItem = styled.div`
  display: flex;
  gap: 1.2rem;
`;
const LegendIndicator = styled.div<{ $color: string }>`
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background: ${(p) => p.$color};
  margin-top: 0.4rem;
  flex-shrink: 0;
  ${bp.mobile} {
    width: 1.2rem;
    height: 1.2rem;
  }
`;
const LegendText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;
const LegendLabel = styled.span`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${t.neutral900};
  line-height: 1.4;
  ${bp.mobile} {
    font-size: 1.5rem;
  }
`;
const LegendDescription = styled.p`
  font-size: 1.5rem;
  line-height: 1.6;
  color: ${t.slate500};
  margin: 0;
  ${bp.mobile} {
    font-size: 1.3rem;
    line-height: 1.5;
  }
`;

const ShowcaseSection = styled.section`
  margin-top: 3.2rem;
  border: 1px solid ${t.slate200};
  border-top: 3px solid ${t.green500};
  border-radius: ${t.rLg};
  overflow: hidden;
  animation: ${fadeSlideUp} 0.5s ease-out;
`;

const ShowcaseHeader = styled.div`
  padding: 2rem 2.4rem 1.6rem;
  background: linear-gradient(180deg, ${t.neutral50} 0%, ${t.white} 100%);
  border-bottom: 1px solid ${t.slate200};
  ${bp.mobile} {
    padding: 1.6rem;
  }
`;

const ShowcaseEyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${t.green600};
  font-family: ${t.font};
  margin-bottom: 0.8rem;
`;

const ShowcaseTitle = styled.h4`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${t.neutral900};
  margin: 0 0 1rem;
  font-family: ${t.font};
  letter-spacing: -0.01em;
  line-height: 1.3;
  ${bp.mobile} {
    font-size: 1.6rem;
  }
`;

const ShowcaseDescription = styled.p`
  font-size: 1.5rem;
  line-height: 1.7;
  color: ${t.slate600};
  margin: 0;
  max-width: 72ch;
  strong {
    color: ${t.neutral800};
    font-weight: 600;
  }
  ${bp.mobile} {
    font-size: 1.4rem;
    line-height: 1.65;
  }
`;

const ShowcaseBody = styled.div`
  padding: 2rem 2.4rem;
  background: ${t.white};
  ${bp.mobile} {
    padding: 1.6rem;
  }
`;

const ShowcaseActions = styled.div`
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  ${bp.mobile} {
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 1.6rem;
  }
`;

const ShowcaseButton = styled.button<{
  $variant?: "primary" | "secondary";
  $isLoading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 1.1rem 2.2rem;
  min-height: 4.4rem;
  font-family: ${t.font};
  font-size: 1.5rem;
  font-weight: 600;
  border: none;
  border-radius: ${t.rMd};
  cursor: ${(p) => (p.$isLoading ? "not-allowed" : "pointer")};
  opacity: ${(p) => (p.$isLoading ? 0.6 : 1)};
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${t.shSm};
  flex: 1;
  max-width: 320px;
  white-space: nowrap;
  ${(p) =>
    p.$variant === "secondary"
      ? `background:${t.blueBase};color:${t.white};
         &:hover:not(:disabled){background:${t.blueDark};transform:translateY(-2px);box-shadow:${t.shMd};}
         &:active:not(:disabled){background:${t.blueDark};transform:translateY(0);}`
      : `background:${t.green500};color:${t.white};
         &:hover:not(:disabled){background:${t.green400};transform:translateY(-2px);box-shadow:${t.shMd};}
         &:active:not(:disabled){background:${t.green600};transform:translateY(0);}`}
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(85, 197, 122, 0.3);
  }
  ${bp.mobile} {
    max-width: none;
    width: 100%;
    padding: 1rem 1.6rem;
    font-size: 1.4rem;
  }
  @media (prefers-reduced-motion: reduce) {
    transition:
      background 0.25s ease,
      box-shadow 0.25s ease;
    &:hover:not(:disabled) {
      transform: none;
    }
    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

const InteractionStrip = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4rem;
  padding: 1.4rem 1.8rem;
  background: ${t.white};
  border: 1px solid ${t.slate200};
  border-left: 3px solid ${t.green500};
  border-radius: ${t.rMd};
  margin-bottom: 1.6rem;
  flex-wrap: wrap;
  ${bp.mobile} {
    gap: 1rem;
    padding: 1.2rem;
  }
`;

const InteractionLabel = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${t.neutral900};
  font-family: ${t.font};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
`;

const ClickCounterBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.7rem 1.4rem;
  min-height: 3.4rem;
  background: ${t.green500};
  color: ${t.white};
  border: none;
  border-radius: ${t.rMd};
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 600;
  font-family: ${t.font};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    background: ${t.green400};
    transform: translateY(-1px);
    box-shadow: ${t.shMd};
  }
  &:active {
    background: ${t.green600};
    transform: translateY(0) scale(0.98);
  }
  ${bp.mobile} {
    font-size: 1.4rem;
    min-height: 3.2rem;
    padding: 0.6rem 1.2rem;
  }
  @media (prefers-reduced-motion: reduce) {
    transition:
      background 0.2s ease,
      box-shadow 0.2s ease;
    &:hover {
      transform: none;
    }
    &:active {
      transform: none;
    }
  }
`;

const InteractionStatus = styled.span<{ $color: string }>`
  font-size: 1.3rem;
  font-weight: 500;
  color: ${(p) => p.$color};
  line-height: 1.5;
  ${bp.small} {
    display: none;
  }
`;

const ComparisonPanel = styled.div`
  padding: 1.6rem;
  background: ${t.slate50};
  border: 1px solid ${t.slate200};
  border-radius: ${t.rMd};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.6rem;
  animation: ${fadeSlideUp} 0.4s ease-out;
  ${bp.mobile} {
    gap: 1.2rem;
    padding: 1.2rem;
  }
  ${bp.small} {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;

const MetricCard = styled.div`
  text-align: center;
  ${bp.small} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    padding: 0.8rem 1.2rem;
    background: ${t.white};
    border-radius: ${t.rMd};
    border: 1px solid ${t.slate200};
  }
`;

const MetricLabel = styled.div`
  font-size: 1.1rem;
  color: ${t.slate500};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.6rem;
  font-weight: 600;
  line-height: 1.3;
  ${bp.small} {
    margin-bottom: 0;
    flex: 1;
  }
`;

const MetricValue = styled.div<{ $highlight?: boolean }>`
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${(p) => (p.$highlight ? t.successBase : t.neutral900)};
  margin-bottom: 0.6rem;
  line-height: 1.2;
  ${bp.mobile} {
    font-size: 2.4rem;
  }
  ${bp.small} {
    font-size: 1.8rem;
    margin-bottom: 0;
    margin-left: 0.8rem;
  }
`;

const PerformanceBadge = styled.div<{ $improved?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: ${t.rFull};
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${(p) => (p.$improved ? t.successLight : t.warningLight)};
  color: ${(p) => (p.$improved ? t.successDark : t.warningDark)};
  ${bp.small} {
    display: none;
  }
`;

const DebugBar = styled.div`
  padding: 0.8rem;
  background: ${t.slate100};
  border-radius: ${t.rMd};
  font-size: 1.2rem;
  color: ${t.slate500};
  margin-bottom: 1.6rem;
  font-family: monospace;
  line-height: 1.5;
`;

// ─── Main Component ────────────────────────────────────────────────────────────

export function RevenueTrendChart() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmall = useMediaQuery("(max-width: 480px)");

  const [masterYear, setMasterYear] = useState(DEFAULT_MASTER_YEAR);
  const [activeTimeRange, setActiveTimeRange] = useState<TimeRange>("1Y");

  const hasInitializedRange = useRef(false);
  useEffect(() => {
    if (!hasInitializedRange.current) {
      hasInitializedRange.current = true;
      setActiveTimeRange(isMobile ? "3M" : "1Y");
    }
  }, [isMobile]);

  const [periodOffset, setPeriodOffset] = useState(0);

  const rangeConfig = RANGE_CONFIG[activeTimeRange];
  const activeGroupBy: GroupBy = isMobile
    ? rangeConfig.mobileGroupBy
    : rangeConfig.desktopGroupBy;

  const periodWindow = useMemo(
    () => computePeriodWindow(activeTimeRange, periodOffset, masterYear),
    [activeTimeRange, periodOffset, masterYear]
  );

  const canGoBack =
    activeTimeRange === "1Y"
      ? false // Year selector handles backward navigation
      : periodOffset > getMinOffset(activeTimeRange);

  const canGoForward = canNavigateForward(
    activeTimeRange,
    periodOffset,
    masterYear
  );

  const handlePrevPeriod = () => {
    if (!canGoBack) return;
    setPeriodOffset((o) => o - 1);
  };

  const handleNextPeriod = () => {
    if (!canGoForward) return;
    setPeriodOffset((o) => o + 1);
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setActiveTimeRange(range);
    const validOffset = findMostRecentValidOffset(range, masterYear);
    setPeriodOffset(validOffset);
  };

  const handleYearChange = (newYear: number) => {
    setMasterYear(newYear);
    // Reset to most recent valid period in the new year
    const validOffset = findMostRecentValidOffset(activeTimeRange, newYear);
    setPeriodOffset(validOffset);
  };

  const [transformMode, setTransformMode] = useState<
    "none" | "worker" | "sync"
  >("none");
  const [clickCount, setClickCount] = useState(0);
  const [isPainting, setIsPainting] = useState(false);
  const [workerData, setWorkerData] = useState<LineChartSerie[] | null>(null);
  const [workerLoading, setWorkerLoading] = useState(false);
  const [workerTime, setWorkerTime] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncData, setSyncData] = useState<LineChartSerie[] | null>(null);
  const [syncTime, setSyncTime] = useState<number | null>(null);
  const [visibleData, setVisibleData] = useState<LineChartSerie[] | null>(null);
  const [workerReady, setWorkerReady] = useState(false);
  const [workerDebugInfo, setWorkerDebugInfo] = useState<string>("");

  const [isPending, startTransition] = useTransition();

  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const pendingRequests = useRef<Map<string, PendingRequest>>(new Map());

  const dateRange = useMemo(
    () => ({
      startDate: `${masterYear}-01-01`,
      endDate: `${masterYear}-12-31`,
      groupBy: "day",
    }),
    [masterYear]
  );

  const {
    data: rawData,
    isLoading: isFetching,
    error: fetchError,
  } = useQuery({
    queryKey: ["revenueTrend", dateRange],
    queryFn: () =>
      fetchRevenueTrend(
        dateRange.startDate,
        dateRange.endDate,
        dateRange.groupBy
      ),
    staleTime: 5 * 60 * 1000,
  });

  const processedData = useMemo<RevenueTrendData[] | null>(() => {
    if (!rawData?.length) return null;
    const windowed = getDateRangeData(
      rawData,
      periodWindow.start,
      periodWindow.end
    );
    const aggregated = aggregateData(windowed, activeGroupBy);
    return aggregated;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData, periodWindow.start, periodWindow.end, activeGroupBy]);

  const pointCount = processedData?.length ?? 0;

  useEffect(() => {
    try {
      const worker = new RevenueTrendAnalysisWorker();
      workerRef.current = worker;

      worker.onmessage = (event) => {
        const { type, id, result, error, executionTime } = event.data;

        if (type === "READY") {
          setWorkerReady(true);
          setWorkerDebugInfo(
            `Worker ready at ${new Date().toLocaleTimeString()}`
          );
        } else if (type === "RESULT" && id) {
          const req = pendingRequests.current.get(id);
          if (req) {
            req.resolve({
              result,
              executionTime: executionTime || performance.now() - req.startTime,
            });
            pendingRequests.current.delete(id);
          }
        } else if (type === "ERROR" && id) {
          const req = pendingRequests.current.get(id);
          if (req) {
            req.reject(new Error(error));
            pendingRequests.current.delete(id);
          }
        }
      };

      worker.onerror = (e) => {
        setWorkerDebugInfo(`Worker error: ${e.message || "Check console"}`);
        pendingRequests.current.forEach(({ reject }) =>
          reject(new Error("Worker error"))
        );
        pendingRequests.current.clear();
      };
    } catch (e) {
      setWorkerDebugInfo(
        e instanceof Error
          ? `Failed to create worker: ${e.message}`
          : "Failed to create worker"
      );
    }
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const transformWithWorker = useCallback(
    (
      data: RevenueTrendData[]
    ): Promise<{ result: LineChartSerie[]; executionTime: number }> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          reject(new Error("Worker not initialized"));
          return;
        }

        const id = `req_${++requestIdRef.current}`;
        const startTime = performance.now();
        const timeoutId = setTimeout(() => {
          if (pendingRequests.current.has(id)) {
            pendingRequests.current.delete(id);
            reject(new Error("Worker timeout"));
          }
        }, 30_000);

        pendingRequests.current.set(id, {
          resolve,
          reject,
          startTime,
          timeoutId,
        });
        workerRef.current.postMessage({ type: "TRANSFORM_REVENUE", data, id });
      });
    },
    []
  );

  useEffect(() => {
    if (!processedData?.length || !workerReady) return;

    setWorkerData(null);
    setVisibleData(null);
    setSyncData(null);
    setWorkerTime(null);
    setSyncTime(null);
    setTransformMode("worker");
    setWorkerLoading(true);

    transformWithWorker(processedData)
      .then(({ result, executionTime }) => {
        startTransition(() => {
          setWorkerData(result);
          setWorkerTime(executionTime);
        });
      })
      .catch(() => {})
      .finally(() => setWorkerLoading(false));
  }, [processedData, workerReady, transformWithWorker]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleWorkerTransform = useCallback(async () => {
    if (!processedData?.length || !workerReady) return;

    setTransformMode("worker");
    setWorkerLoading(true);
    try {
      const { result, executionTime } =
        await transformWithWorker(processedData);
      startTransition(() => {
        setWorkerData(result);
        setWorkerTime(executionTime);
      });
    } catch {
      /* silent */
    } finally {
      setWorkerLoading(false);
    }
  }, [processedData, workerReady, transformWithWorker]);

  function transformRevenueData(data: RevenueTrendData[]): LineChartSerie[] {
    const start = performance.now();
    while (performance.now() - start < 3000) {
      /* intentional busy-wait */
    }
    return [
      { id: "Revenue", data: data.map((d) => ({ x: d.date, y: d.revenue })) },
      {
        id: "7-Day Moving Avg",
        data: (() => {
          const avg: LineChartDatum[] = [];
          for (let i = 6; i < data.length; i++) {
            avg.push({
              x: data[i].date,
              y:
                data.slice(i - 6, i + 1).reduce((s, r) => s + r.revenue, 0) / 7,
            });
          }
          return avg;
        })(),
      },
      {
        id: "Bookings (×1000)",
        data: data.map((d) => ({ x: d.date, y: d.bookings * 1000 })),
      },
    ];
  }

  const handleSyncTransform = () => {
    if (!processedData) return;
    setIsSyncing(true);
    setTransformMode("sync");
    setTimeout(() => {
      const t0 = performance.now();
      const r = transformRevenueData(processedData);
      setSyncData(r);
      setSyncTime(performance.now() - t0);
      setIsSyncing(false);
    }, 50);
  };

  const chartData = useMemo(() => {
    if (transformMode === "worker" && workerData) return workerData;
    if (transformMode === "sync" && syncData) return syncData;
    return null;
  }, [transformMode, workerData, syncData]);

  useEffect(() => {
    if (!chartData) return;
    setIsPainting(true);

    let chunk = 0;
    const totalChunks = 4;
    const chunkSize = Math.ceil((chartData[0]?.data.length ?? 0) / totalChunks);

    const next = () => {
      if (chunk < totalChunks) {
        setVisibleData(
          chartData.map((s) => ({
            ...s,
            data: s.data.slice(0, (chunk + 1) * chunkSize),
          }))
        );
        chunk++;
        requestAnimationFrame(next);
      } else {
        setVisibleData(chartData);
        setIsPainting(false);
      }
    };
    next();
  }, [chartData]);

  const chartMargin = isMobile
    ? { top: 16, right: 16, bottom: isSmall ? 44 : 52, left: isSmall ? 52 : 62 }
    : { top: 50, right: 140, bottom: 80, left: 90 };

  const tickEvery = (() => {
    if (pointCount <= 13) return 1;
    if (pointCount <= 30) return isMobile ? 7 : 1;
    if (pointCount <= 52) return isMobile ? 4 : 2;
    if (pointCount <= 90) return isMobile ? 14 : 7;
    return isMobile ? 60 : 30;
  })();

  const axisBottomConfig = {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: isMobile ? -60 : -45,
    legend: isMobile ? "" : "Date",
    legendOffset: isMobile ? 0 : 60,
    legendPosition: "middle" as const,
    tickValues:
      chartData?.[0]?.data
        .filter((_: LineChartDatum, i: number) => i % tickEvery === 0)
        .map((d: LineChartDatum) => d.x) ?? [],
    format: (v: string) => formatAxisTick(v, activeGroupBy),
  };

  const axisLeftConfig = {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: isMobile ? "" : "Revenue ($)",
    legendOffset: isMobile ? 0 : -70,
    legendPosition: "middle" as const,
    format: (v: number) => `$${(v / 1000).toFixed(0)}K`,
  };

  const nivoLegends = isMobile
    ? []
    : [
        {
          anchor: "bottom-right" as const,
          direction: "column" as const,
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right" as const,
          itemOpacity: 0.85,
          symbolSize: 12,
          symbolShape: "circle" as const,
          effects: [{ on: "hover" as const, style: { itemOpacity: 1 } }],
        },
      ];

  if (isFetching) {
    return (
      <ChartContainer>
        <ChartHeader>
          <TitleBlock>
            <ChartTitle>Revenue Trend Analysis</ChartTitle>
            <ChartSubtitle>Loading {masterYear} data…</ChartSubtitle>
          </TitleBlock>
        </ChartHeader>
        <ChartWrapper>
          <LoadingOverlay>
            <LoadingContent>
              <Spinner />
              <LoadingText>Loading revenue data…</LoadingText>
            </LoadingContent>
          </LoadingOverlay>
        </ChartWrapper>
      </ChartContainer>
    );
  }

  if (fetchError) {
    return (
      <ChartContainer>
        <ChartHeader>
          <TitleBlock>
            <ChartTitle>Revenue Trend Analysis</ChartTitle>
          </TitleBlock>
        </ChartHeader>
        <ErrorContainer>
          <h4>Failed to load data</h4>
          <p>
            {fetchError instanceof Error
              ? fetchError.message
              : String(fetchError)}
          </p>
        </ErrorContainer>
      </ChartContainer>
    );
  }

  if (!rawData?.length) {
    return (
      <ChartContainer>
        <ChartHeader>
          <TitleBlock>
            <ChartTitle>Revenue Trend Analysis</ChartTitle>
          </TitleBlock>
        </ChartHeader>
        <EmptyState>
          <h4>No data available</h4>
          <p>There are no bookings in the selected date range.</p>
        </EmptyState>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <TitleBlock>
          <ChartTitle>Revenue Trend Analysis</ChartTitle>
          <ChartSubtitle>
            Booking revenue and trends for {periodWindow.label}
          </ChartSubtitle>
        </TitleBlock>
        <WorkerStatusPill $ready={workerReady}>
          {workerReady ? "Worker Ready" : "Initializing"}
        </WorkerStatusPill>
      </ChartHeader>

      {process.env.NODE_ENV === "development" && workerDebugInfo && (
        <DebugBar>Debug: {workerDebugInfo}</DebugBar>
      )}

      {/* ─── Year Selector (Separate, always visible) ─────────────────────── */}
      <YearSelectorRow>
        <YearLabel>Data Year:</YearLabel>
        <YearSelector>
          <YearArrow
            onClick={() => handleYearChange(masterYear - 1)}
            disabled={
              masterYear <= OLDEST_ALLOWED_YEAR || workerLoading || isSyncing
            }
            aria-label="Previous year"
            title={
              masterYear <= OLDEST_ALLOWED_YEAR
                ? "No earlier data available"
                : "Previous year"
            }
          >
            <ChevronLeftIcon
              height={14}
              width={14}
              stroke="currentColor"
              strokeWidth={2}
            />
          </YearArrow>

          <YearDisplay>{masterYear}</YearDisplay>

          <YearArrow
            onClick={() => handleYearChange(masterYear + 1)}
            disabled={masterYear >= CURRENT_YEAR || workerLoading || isSyncing}
            aria-label="Next year"
            title={
              masterYear >= CURRENT_YEAR
                ? "Cannot navigate to future years"
                : "Next year"
            }
          >
            <ChevronRightIcon
              height={14}
              width={14}
              stroke="currentColor"
              strokeWidth={2}
            />
          </YearArrow>
        </YearSelector>
      </YearSelectorRow>

      {/* ─── Time Range + Period Navigator ────────────────────────────────── */}
      <TimeNavRow>
        <TimeRangePills role="group" aria-label="Select time range">
          {(Object.keys(RANGE_CONFIG) as TimeRange[]).map((range) => (
            <TimeRangeTab
              key={range}
              $active={activeTimeRange === range}
              onClick={() => handleTimeRangeChange(range)}
              aria-pressed={activeTimeRange === range}
              disabled={workerLoading || isSyncing}
            >
              {RANGE_CONFIG[range].label}
            </TimeRangeTab>
          ))}
        </TimeRangePills>

        <PeriodNav aria-label="Navigate period">
          <NavArrow
            onClick={handlePrevPeriod}
            disabled={!canGoBack || workerLoading || isSyncing}
            aria-label="Previous period"
            title={
              !canGoBack
                ? activeTimeRange === "1Y"
                  ? "Use year selector above"
                  : "No earlier data available"
                : "Previous period"
            }
          >
            <ChevronLeftIcon
              height={14}
              width={14}
              stroke="currentColor"
              strokeWidth={2}
            />
          </NavArrow>
          <PeriodLabel>{periodWindow.label}</PeriodLabel>
          <NavArrow
            onClick={handleNextPeriod}
            disabled={!canGoForward || workerLoading || isSyncing}
            aria-label="Next period"
            title={
              !canGoForward
                ? activeTimeRange === "1Y"
                  ? "Use year selector above"
                  : "Cannot navigate to future periods"
                : "Next period"
            }
          >
            <ChevronRightIcon
              height={14}
              width={14}
              stroke="currentColor"
              strokeWidth={2}
            />
          </NavArrow>
        </PeriodNav>
      </TimeNavRow>

      <div style={{ marginBottom: "1.2rem" }}>
        <GranularityBadge aria-live="polite">
          {GROUP_BY_LABEL[activeGroupBy]} data
          <DataPointCount>&nbsp;({pointCount} pts)</DataPointCount>
        </GranularityBadge>
      </div>

      <ChartWrapper>
        <OptimizedChartWrapper>
          {workerLoading && (
            <LoadingOverlay>
              <LoadingContent>
                <Spinner />
                <LoadingText>
                  Processing {pointCount}{" "}
                  {GROUP_BY_LABEL[activeGroupBy].toLowerCase()} points…
                  {!isMobile && (
                    <>
                      <br />
                      <span
                        style={{
                          fontSize: "1.2rem",
                          color: t.successBase,
                          fontWeight: 600,
                        }}
                      >
                        UI remains interactive 🚀
                      </span>
                    </>
                  )}
                </LoadingText>
              </LoadingContent>
            </LoadingOverlay>
          )}

          {chartData ? (
            <ResponsiveLine
              data={visibleData ?? []}
              enableSlices={!isPainting && !isPending ? "x" : false}
              useMesh={!isPainting && !isPending}
              animate={!isPainting && !isPending}
              enableArea={!isPainting && !isPending}
              enablePoints={!isPainting && !isPending}
              enableGridX={!isPainting && !isPending}
              enableGridY={!isPainting && !isPending}
              enableCrosshair={!isPainting && !isPending}
              isInteractive={!isPainting && !isPending}
              margin={chartMargin}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: false,
                reverse: false,
              }}
              curve="monotoneX"
              axisTop={null}
              axisRight={null}
              axisBottom={axisBottomConfig}
              axisLeft={axisLeftConfig}
              colors={[t.green500, t.blueBase, t.warningBase]}
              lineWidth={isMobile ? 1.5 : 2}
              pointSize={0}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabelYOffset={-12}
              areaOpacity={0.15}
              legends={nivoLegends}
              theme={{
                axis: {
                  ticks: {
                    text: { fontSize: isMobile ? 9 : 11, fill: t.slate500 },
                  },
                  legend: {
                    text: {
                      fontSize: isMobile ? 10 : 12,
                      fill: t.slate500,
                      fontWeight: 600,
                    },
                  },
                },
                grid: { line: { stroke: t.slate200, strokeWidth: 1 } },
              }}
            />
          ) : (
            <EmptyState>
              <h4>
                {!workerReady ? "Initializing Worker…" : "Preparing data…"}
              </h4>
              <p>
                {!workerReady
                  ? "Setting up worker thread for non-blocking processing"
                  : `Processing ${pointCount} ${GROUP_BY_LABEL[activeGroupBy].toLowerCase()} data points`}
              </p>
            </EmptyState>
          )}
        </OptimizedChartWrapper>
      </ChartWrapper>

      {chartData && (
        <LegendContainer>
          <LegendItem>
            <LegendIndicator $color={t.green500} />
            <LegendText>
              <LegendLabel>Revenue</LegendLabel>
              <LegendDescription>
                {activeGroupBy === "day"
                  ? "Daily income from confirmed tour bookings."
                  : activeGroupBy === "week"
                    ? "Total weekly revenue from confirmed bookings."
                    : "Total monthly revenue from confirmed bookings."}
              </LegendDescription>
            </LegendText>
          </LegendItem>
          <LegendItem>
            <LegendIndicator $color={t.blueBase} />
            <LegendText>
              <LegendLabel>7-Period Moving Avg</LegendLabel>
              <LegendDescription>
                {activeGroupBy === "day"
                  ? "7-day rolling average smoothing short-term noise."
                  : activeGroupBy === "week"
                    ? "7-week rolling average highlighting mid-term trends."
                    : "7-month rolling average showing long-term trajectory."}
              </LegendDescription>
            </LegendText>
          </LegendItem>
          <LegendItem>
            <LegendIndicator $color={t.warningBase} />
            <LegendText>
              <LegendLabel>Bookings (×1000)</LegendLabel>
              <LegendDescription>
                {activeGroupBy === "day"
                  ? "Daily booking count scaled ×1000 for co-display."
                  : `Total bookings per ${activeGroupBy} scaled ×1000.`}
              </LegendDescription>
            </LegendText>
          </LegendItem>
        </LegendContainer>
      )}

      <ShowcaseSection>
        <ShowcaseHeader>
          <ShowcaseEyebrow>⚙ Technical Showcase</ShowcaseEyebrow>
          <ShowcaseTitle>Web Worker vs. Main Thread Processing</ShowcaseTitle>
          <ShowcaseDescription>
            This chart transforms{" "}
            <strong>{rawData.length.toLocaleString()} raw data points</strong>{" "}
            into chart-ready series on every range change — a realistic workload
            in production analytics dashboards. Click{" "}
            <strong>Process with Worker</strong> to run that transformation in a
            dedicated <strong>Web Worker</strong> (off the main thread). The
            interaction counter below proves the UI stays fully responsive
            throughout. Then click <strong>Run on Main Thread</strong> to run
            the same computation synchronously — the browser will freeze for ~3
            s, which is exactly the experience this pattern prevents.
          </ShowcaseDescription>
        </ShowcaseHeader>

        <ShowcaseBody>
          <ShowcaseActions>
            <ShowcaseButton
              onClick={handleWorkerTransform}
              $isLoading={workerLoading}
              disabled={!workerReady || isSyncing}
            >
              {workerLoading && (
                <Spinner
                  style={{
                    width: "1.6rem",
                    height: "1.6rem",
                    borderWidth: "0.2rem",
                  }}
                />
              )}
              {workerLoading
                ? "Processing…"
                : workerReady
                  ? "⚡ Process with Worker"
                  : "Initializing Worker…"}
            </ShowcaseButton>

            <ShowcaseButton
              $variant="secondary"
              onClick={handleSyncTransform}
              $isLoading={isSyncing}
              disabled={workerLoading || isSyncing}
            >
              {isSyncing ? "⚠ Freezing UI…" : "⚠ Run on Main Thread (Blocking)"}
            </ShowcaseButton>
          </ShowcaseActions>

          <InteractionStrip>
            <InteractionLabel>UI Thread Check</InteractionLabel>
            <ClickCounterBtn onClick={() => setClickCount((c) => c + 1)}>
              Clicks: {clickCount}
            </ClickCounterBtn>
            {workerLoading && (
              <InteractionStatus $color={t.successBase}>
                ✓ Still interactive — worker is off the main thread
              </InteractionStatus>
            )}
            {isSyncing && (
              <InteractionStatus $color={t.warningDark}>
                ✗ Click won't register until the main thread unblocks
              </InteractionStatus>
            )}
            {!workerLoading &&
              !isSyncing &&
              (workerTime !== null || syncTime !== null) && (
                <InteractionStatus $color={t.slate500}>
                  ↑ Run both modes above to compare responsiveness
                </InteractionStatus>
              )}
            {!workerLoading &&
              !isSyncing &&
              workerTime === null &&
              syncTime === null && (
                <InteractionStatus $color={t.slate500}>
                  ← Click a button to start the experiment
                </InteractionStatus>
              )}
          </InteractionStrip>

          {(workerTime !== null || syncTime !== null) && (
            <ComparisonPanel>
              <MetricCard>
                <MetricLabel>Worker Transform</MetricLabel>
                <MetricValue $highlight>
                  {workerTime !== null ? `${workerTime.toFixed(0)}ms` : "—"}
                </MetricValue>
                {workerTime !== null && (
                  <PerformanceBadge $improved>Non-blocking ✓</PerformanceBadge>
                )}
              </MetricCard>

              <MetricCard>
                <MetricLabel>Sync Transform</MetricLabel>
                <MetricValue>
                  {syncTime !== null ? `${syncTime.toFixed(0)}ms` : "—"}
                </MetricValue>
                {syncTime !== null && (
                  <PerformanceBadge>UI Blocked ✗</PerformanceBadge>
                )}
              </MetricCard>

              <MetricCard>
                <MetricLabel>Responsiveness Gain</MetricLabel>
                <MetricValue $highlight>
                  {workerTime !== null && syncTime !== null
                    ? `${(((syncTime - workerTime) / syncTime) * 100).toFixed(0)}%`
                    : "—"}
                </MetricValue>
                {workerTime !== null && syncTime !== null && (
                  <PerformanceBadge $improved>
                    {(syncTime / workerTime).toFixed(1)}× faster
                  </PerformanceBadge>
                )}
              </MetricCard>
            </ComparisonPanel>
          )}
        </ShowcaseBody>
      </ShowcaseSection>
    </ChartContainer>
  );
}
