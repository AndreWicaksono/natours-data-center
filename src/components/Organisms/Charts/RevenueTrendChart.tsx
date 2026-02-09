import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import { useQuery } from "@tanstack/react-query";
import { ResponsiveLine } from "@nivo/line";
import styled from "styled-components";

// Import the worker using Vite's worker syntax
import RevenueTrendAnalysisWorker from "../../../workers/revenueTrendAnalysis.worker?worker";

// Add this interface near your other type definitions
interface PendingRequest {
  resolve: (value: { result: LineChartSerie[]; executionTime: number }) => void;
  reject: (reason?: unknown) => void;
  startTime: number;
  timeoutId?: NodeJS.Timeout;
}

// Types (keeping all your existing types)
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

// Add this mock data generator function (reuse your existing logic)
function generateMockRevenueTrend(
  startDate: string,
  endDate: string
): RevenueTrendData[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const results: RevenueTrendData[] = [];

  const currentDate = new Date(start);
  let dayCount = 0;

  while (currentDate <= end) {
    // Create realistic revenue trends
    const baseRevenue = 10000;
    const trend = dayCount * 50; // upward trend over time
    const seasonality = 2000 * Math.sin(dayCount * 0.02); // seasonal pattern
    const noise = (Math.random() - 0.5) * 3000; // random variation
    const dayOfWeekEffect = 500 * Math.sin(dayCount * 0.9); // weekly pattern

    const revenue = Math.max(
      5000,
      baseRevenue + trend + seasonality + noise + dayOfWeekEffect
    );
    const bookings = Math.floor(
      8 + Math.random() * 15 + Math.sin(dayCount * 0.05) * 3
    );

    results.push({
      date: currentDate.toISOString().split("T")[0],
      revenue: Math.round(revenue),
      bookings: Math.max(1, bookings),
    });

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
    dayCount++;
  }

  return results;
}

// GraphQL query function (keeping your existing function)
async function fetchRevenueTrend(
  startDate: string,
  endDate: string,
  groupBy: string
) {
  // In development/staging, use mock data
  if (import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === "true") {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate realistic mock data
    return generateMockRevenueTrend(startDate, endDate);
  }

  // In production, use real API
  const response = await fetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query GetRevenueTrend($startDate: String!, $endDate: String!, $groupBy: String!) {
          revenueTrend(startDate: $startDate, endDate: $endDate, groupBy: $groupBy) {
            date
            revenue
            bookings
          }
        }
      `,
      variables: { startDate, endDate, groupBy },
    }),
  });

  const { data } = await response.json();
  return data.revenueTrend as RevenueTrendData[];
}

// Styled Components (keeping all your existing styled components)
const ChartContainer = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0; /* Slate 200 */
`;

const ChartTitle = styled.h3`
  font-size: 1.5rem;
  line-height: 1.25;
  font-weight: 700;
  color: #1c1c1c;
  letter-spacing: -0.02em;
  margin: 0;
`;

const ControlsGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const InteractivityDemo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0; /* Slate 200 */
  border-left: 4px solid #28b485; /* P500 - Action/Logo Dark */
  font-size: 1rem;
  line-height: 1.6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const ClickCounter = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  height: 2.25rem;
  background: #28b485; /* P500 - Action/Logo Dark */
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #55c57a; /* P400 - Lighter on hover */
    transform: translateY(-1px);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  &:active {
    background: #228b66; /* P600 */
    transform: translateY(0);
  }
`;

const Button = styled.button<{
  $variant?: "primary" | "secondary";
  $isLoading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem; /* btn-md */
  min-height: 2.75rem;
  font-family:
    "Montserrat",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 600;
  letter-spacing: 0.01em;
  border: none;
  border-radius: 0.5rem;
  cursor: ${(props) => (props.$isLoading ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$isLoading ? 0.6 : 1)};
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  ${(props) =>
    props.$variant === "secondary"
      ? `
    background: #00b4d8;
    color: #ffffff;
    
    &:hover:not(:disabled) {
      background: #0077b6;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    &:active:not(:disabled) {
      background: #0077b6;
      transform: translateY(0);
    }
  `
      : `
    background: #28b485; /* P500 - Action/Logo Dark */
    color: #ffffff;
    
    &:hover:not(:disabled) {
      background: #55c57a; /* P400 - Lighter on hover */
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    &:active:not(:disabled) {
      background: #228b66; /* P600 */
      transform: translateY(0);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(85, 197, 122, 0.2);
  }
`;

const PerformanceBadge = styled.div<{ $improved?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  line-height: 1.5;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${(props) => (props.$improved ? "#e6f7f0" : "#fff8e1")};
  color: ${(props) => (props.$improved ? "#1b8a29" : "#b8843b")};
`;

const ChartWrapper = styled.div`
  height: 400px;
  position: relative;
  overflow: visible;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  z-index: 1;
  pointer-events: none;
`;

const LoadingContent = styled.div`
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0; /* Slate 200 */
  border-top-color: #28b485; /* P500 */
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.6;
  color: #64748b; /* Slate 500 */
  text-align: center;
`;

const ErrorContainer = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: #bb2124;
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #64748b; /* Slate 500 */
`;

const ComparisonPanel = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc; /* Slate 50 */
  border: 1px solid #e2e8f0; /* Slate 200 */
  border-radius: 0.5rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  animation: slideUp 0.4s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MetricCard = styled.div`
  text-align: center;
`;

const MetricLabel = styled.div`
  font-size: 0.75rem;
  line-height: 1.5;
  color: #64748b; /* Slate 500 */
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const MetricValue = styled.div<{ $highlight?: boolean }>`
  font-size: 2rem;
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${(props) => (props.$highlight ? "#22bb33" : "#1c1c1c")};
  margin-bottom: 0.5rem;
`;

const LegendContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f1f5f9; /* Slate 100 */
  border-radius: 0.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const LegendItem = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const LegendIndicator = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  margin-top: 0.25rem;
  flex-shrink: 0;
`;

const LegendText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const LegendLabel = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #1c1c1c;
`;

const LegendDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: #64748b; /* Slate 500 */
  margin: 0;
`;

// Add CSS containment to reduce layout calculations
const OptimizedChartWrapper = styled.div`
  height: 400px;
  position: relative;
  overflow: visible;
  transform: translateZ(0);
  will-change: transform;
`;

// Main Component
export function RevenueTrendChart() {
  const [transformMode, setTransformMode] = useState<
    "none" | "worker" | "sync"
  >("none");
  const [clickCount, setClickCount] = useState(0);
  const [isPainting, setIsPainting] = useState(false);
  const [workerData, setWorkerData] = useState<LineChartSerie[] | null>(null);
  const [workerLoading, setWorkerLoading] = useState(false);
  const [workerTime, setWorkerTime] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false); // New state for sync feedback
  const [syncData, setSyncData] = useState<LineChartSerie[] | null>(null);
  const [syncTime, setSyncTime] = useState<number | null>(null);
  const [hasAutoTransformed, setHasAutoTransformed] = useState(false);
  const [visibleData, setVisibleData] = useState<LineChartSerie[] | null>(null);
  const [workerReady, setWorkerReady] = useState(false);
  const [workerDebugInfo, setWorkerDebugInfo] = useState<string>("");

  const [isPending, startTransition] = useTransition();

  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const pendingRequests = useRef<Map<string, PendingRequest>>(new Map());

  const [dateRange] = useState({
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    groupBy: "day",
  });

  // Fetch data with React Query
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

  // Initialize worker on component mount
  useEffect(() => {
    try {
      // Create worker using Vite's worker syntax
      const worker = new RevenueTrendAnalysisWorker();
      workerRef.current = worker;

      // Handle messages from worker
      worker.onmessage = (event) => {
        const { type, id, result, error, executionTime } = event.data;

        if (type === "READY") {
          setWorkerReady(true);
          setWorkerDebugInfo(
            `Worker ready at ${new Date().toLocaleTimeString()}`
          );
        } else if (type === "RESULT" && id) {
          const request = pendingRequests.current.get(id);
          if (request) {
            const endTime = performance.now();
            const totalTime = executionTime || endTime - request.startTime;

            request.resolve({
              result,
              executionTime: totalTime,
            });
            pendingRequests.current.delete(id);
          }
        } else if (type === "ERROR" && id) {
          const request = pendingRequests.current.get(id);
          if (request) {
            // console.error("🔴 Worker transform failed:", error);
            request.reject(new Error(error));
            pendingRequests.current.delete(id);
          }
        }
      };

      worker.onerror = (error) => {
        // console.error("🔴 Worker error details:", {
        //   message: error.message,
        //   filename: error.filename,
        //   lineno: error.lineno,
        //   colno: error.colno,
        //   error: error.error,
        // });
        setWorkerDebugInfo(
          `Worker error: ${error.message || "Check console for details"}`
        );

        // Reject all pending requests
        pendingRequests.current.forEach(({ reject }) => {
          reject(new Error("Worker error occurred"));
        });
        pendingRequests.current.clear();
      };

      worker.onmessageerror = () => {
        // console.error("🔴 Worker message error:", event);
        setWorkerDebugInfo("Worker message error - check data types");
      };
    } catch (error) {
      // console.error("🔴 Failed to create worker:", error);
      // Type-safe error handling
      if (error instanceof Error) {
        setWorkerDebugInfo(`Failed to create worker: ${error.message}`);
      } else {
        setWorkerDebugInfo("Failed to create worker: Unknown error");
      }
    }

    // Cleanup
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // Function to send data to worker
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

        // Add timeout for worker response
        const timeoutId = setTimeout(() => {
          if (pendingRequests.current.has(id)) {
            pendingRequests.current.delete(id);
            reject(new Error("Worker timeout after 30 seconds"));
          }
        }, 30000); // 30 second timeout

        // Store the promise handlers with timeoutId
        pendingRequests.current.set(id, {
          resolve,
          reject,
          startTime,
          timeoutId,
        });

        // Send data to worker
        workerRef.current.postMessage({
          type: "TRANSFORM_REVENUE",
          data,
          id,
        });
      });
    },
    []
  );

  // Heavy data transformation function (runs synchronously)
  function transformRevenueData(rawData: RevenueTrendData[]): LineChartSerie[] {
    // Simulate complex transformation with intentional delay
    // BLOCKING: Force the main thread to hang for 1.5 seconds to demonstrate the issue
    const start = performance.now();
    while (performance.now() - start < 3000) {
      // Busy wait to block the main thread
    }

    // Transform data into Nivo Line format
    const revenueData: LineChartDatum[] = rawData.map((item) => ({
      x: item.date,
      y: item.revenue,
    }));

    const bookingsData: LineChartDatum[] = rawData.map((item) => ({
      x: item.date,
      y: item.bookings * 1000,
    }));

    // Calculate moving average (7-day)
    const movingAvg: LineChartDatum[] = [];
    for (let i = 6; i < rawData.length; i++) {
      const sum = rawData
        .slice(i - 6, i + 1)
        .reduce((acc, item) => acc + item.revenue, 0);
      movingAvg.push({
        x: rawData[i].date,
        y: sum / 7,
      });
    }

    return [
      { id: "Revenue", data: revenueData },
      { id: "7-Day Moving Avg", data: movingAvg },
      { id: "Bookings (×1000)", data: bookingsData },
    ];
  }

  // Transform with worker - add detailed logging
  const handleWorkerTransform = useCallback(
    async (isAuto = false) => {
      if (!rawData) {
        return;
      }

      if (!workerReady) {
        return;
      }

      setTransformMode("worker");
      setWorkerLoading(true);

      try {
        const { result, executionTime } = await transformWithWorker(rawData);

        startTransition(() => {
          setWorkerData(result);
          setWorkerTime(executionTime);
        });

        if (isAuto) {
          setHasAutoTransformed(true);
        }
      } catch (error) {
        // console.error("🔴 Main: Worker transform failed:", error);
        // Type-safe error handling
        if (error instanceof Error) {
          // console.error("🔴 Error details:", error.message);
        } else {
          // console.error("🔴 Unknown error type:", error);
        }
      } finally {
        setWorkerLoading(false);
      }
    },
    [rawData, workerReady, transformWithWorker]
  );

  // Transform synchronously (blocking)
  const handleSyncTransform = () => {
    if (!rawData) return;

    // 1. Set loading state immediately
    setIsSyncing(true);
    setTransformMode("sync");

    // 2. Defer the heavy work slightly to allow React to render the "Loading" state
    // This ensures the user sees the button change BEFORE the browser freezes.
    setTimeout(() => {
      const startTime = performance.now();
      const result = transformRevenueData(rawData);
      const endTime = performance.now();

      setSyncData(result);
      setSyncTime(endTime - startTime);
      setIsSyncing(false);
    }, 50);
  };
  // Determine which data to show
  const chartData = useMemo(() => {
    if (transformMode === "worker" && workerData) {
      return workerData;
    }
    if (transformMode === "sync" && syncData) {
      return syncData;
    }
    return null;
  }, [transformMode, workerData, syncData]);

  // Auto-transform with worker on initial data load
  useEffect(() => {
    if (
      rawData &&
      rawData.length > 0 &&
      workerReady &&
      transformMode === "none" &&
      !hasAutoTransformed
    ) {
      // Auto-transform with worker for better UX
      handleWorkerTransform(true);
    }
  }, [
    rawData,
    workerReady,
    transformMode,
    hasAutoTransformed,
    handleWorkerTransform,
  ]);

  // Progressive painting effect
  useEffect(() => {
    if (chartData) {
      setIsPainting(true);

      let currentChunk = 0;
      const totalChunks = 4;
      const chunkSize = Math.ceil(chartData[0]?.data.length / totalChunks);

      const renderNextChunk = () => {
        if (currentChunk < totalChunks) {
          const chunkedData = chartData.map((series) => ({
            ...series,
            data: series.data.slice(0, (currentChunk + 1) * chunkSize),
          }));

          setVisibleData(chunkedData);
          currentChunk++;
          requestAnimationFrame(renderNextChunk);
        } else {
          setVisibleData(chartData);
          setIsPainting(false);
        }
      };

      renderNextChunk();
    }
  }, [chartData]);

  // Loading state - fetching data
  if (isFetching) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Revenue Trend Analysis</ChartTitle>
        </ChartHeader>
        <ChartWrapper>
          <LoadingOverlay>
            <Spinner />
            <LoadingText>Loading revenue data...</LoadingText>
          </LoadingOverlay>
        </ChartWrapper>
      </ChartContainer>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Revenue Trend Analysis</ChartTitle>
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

  // Empty state
  if (!rawData || rawData.length === 0) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Revenue Trend Analysis</ChartTitle>
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
        <ChartTitle>Revenue Trend Analysis</ChartTitle>
        <ControlsGroup>
          <Button
            onClick={() => handleWorkerTransform(false)}
            $isLoading={workerLoading}
            disabled={!workerReady || isSyncing}
          >
            {workerLoading && <Spinner style={{ width: 20, height: 20 }} />}
            {workerLoading
              ? "Processing..."
              : workerReady
                ? "Process with Worker"
                : "Worker Initializing..."}
          </Button>
          <Button
            $variant="secondary"
            onClick={handleSyncTransform}
            $isLoading={isSyncing}
            disabled={workerLoading || isSyncing}
          >
            {isSyncing ? "Freezing UI..." : "Run on Main Thread (Blocking)"}
          </Button>

          <InteractivityDemo>
            <span
              style={{
                color: "#1c1c1c",
                fontWeight: 700,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Interaction Check:
            </span>
            <ClickCounter onClick={() => setClickCount((c) => c + 1)}>
              Test Clicks: {clickCount}
            </ClickCounter>
            {workerLoading && (
              <span
                style={{
                  color: "#22bb33",
                  fontSize: "0.75rem",
                }}
              >
                ✓ Still clickable!
              </span>
            )}
            {workerReady && !workerLoading && (
              <span style={{ color: "#00b4d8", fontSize: "0.75rem" }}>
                Worker Ready ✓
              </span>
            )}
          </InteractivityDemo>
        </ControlsGroup>
      </ChartHeader>

      {/* Debug Info Panel */}
      {process.env.NODE_ENV === "development" && workerDebugInfo && (
        <div
          style={{
            padding: "0.5rem",
            background: "#f1f5f9",
            borderRadius: "0.25rem",
            fontSize: "0.75rem",
            color: "#64748b",
            marginBottom: "1rem",
          }}
        >
          Debug: {workerDebugInfo}
        </div>
      )}

      <ChartWrapper>
        <OptimizedChartWrapper>
          {workerLoading && (
            <LoadingOverlay>
              <LoadingContent>
                <Spinner />
                <LoadingText>
                  Processing {rawData.length.toLocaleString()} data points in
                  worker...
                  <br />
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#22bb33",
                    }}
                  >
                    UI remains interactive! 🚀
                  </span>
                </LoadingText>
              </LoadingContent>
            </LoadingOverlay>
          )}

          {chartData ? (
            <ResponsiveLine
              data={visibleData || []} // Use progressive data
              enableSlices={!isPainting && !isPending ? "x" : false}
              useMesh={!isPainting && !isPending}
              animate={!isPainting && !isPending}
              enableArea={!isPainting && !isPending}
              enablePoints={!isPainting && !isPending}
              enableGridX={!isPainting && !isPending}
              enableGridY={!isPainting && !isPending}
              enableCrosshair={!isPainting && !isPending}
              isInteractive={!isPainting && !isPending}
              margin={{ top: 50, right: 140, bottom: 80, left: 90 }}
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
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: "Date",
                legendOffset: 60,
                legendPosition: "middle",
                tickValues:
                  chartData[0]?.data
                    .filter(
                      (_: LineChartDatum, index: number) => index % 30 === 0
                    )
                    .map((d: LineChartDatum) => d.x) || [],
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Revenue ($)",
                legendOffset: -70,
                legendPosition: "middle",
                format: (value: number) => `$${(value / 1000).toFixed(0)}K`,
              }}
              colors={["#28b485", "#00b4d8", "#f0ad4e"]}
              lineWidth={2}
              pointSize={0}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabelYOffset={-12}
              // enableArea={true}
              areaOpacity={0.15}
              // useMesh={!isPending}
              // enableSlices={!isPending ? "x": false}
              legends={[
                {
                  anchor: "bottom-right",
                  direction: "column",
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: "left-to-right",
                  itemOpacity: 0.85,
                  symbolSize: 12,
                  symbolShape: "circle",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
            />
          ) : (
            <EmptyState>
              <h4>
                {!workerReady
                  ? "Initializing Worker..."
                  : "Preparing your data..."}
              </h4>
              <p>
                {!workerReady
                  ? "Setting up worker thread for non-blocking processing"
                  : `Processing ${rawData.length.toLocaleString()} data points`}
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  marginTop: "0.5rem",
                  color: "#b3b3b3",
                }}
              >
                {!workerReady
                  ? "This happens once per page load"
                  : "Using Web Worker for non-blocking processing"}
              </p>
            </EmptyState>
          )}
        </OptimizedChartWrapper>
      </ChartWrapper>

      {(workerTime !== null || syncTime !== null) && (
        <ComparisonPanel>
          <MetricCard>
            <MetricLabel>Worker Transform</MetricLabel>
            <MetricValue $highlight>
              {workerTime !== null ? `${workerTime.toFixed(0)}ms` : "-"}
            </MetricValue>
            {workerTime !== null && (
              <PerformanceBadge $improved>Non-blocking ✓</PerformanceBadge>
            )}
          </MetricCard>

          <MetricCard>
            <MetricLabel>Sync Transform</MetricLabel>
            <MetricValue>
              {syncTime !== null ? `${syncTime.toFixed(0)}ms` : "-"}
            </MetricValue>
            {syncTime !== null && (
              <PerformanceBadge>UI Blocked ✗</PerformanceBadge>
            )}
          </MetricCard>

          <MetricCard>
            <MetricLabel>Performance Gain</MetricLabel>
            <MetricValue $highlight>
              {workerTime !== null && syncTime !== null
                ? `${(((syncTime - workerTime) / syncTime) * 100).toFixed(0)}%`
                : "-"}
            </MetricValue>
            {workerTime !== null && syncTime !== null && (
              <PerformanceBadge $improved>
                {(syncTime / workerTime).toFixed(1)}× faster
              </PerformanceBadge>
            )}
          </MetricCard>
        </ComparisonPanel>
      )}

      {chartData && (
        <LegendContainer>
          <LegendItem>
            <LegendIndicator $color="#28b485" />
            <LegendText>
              <LegendLabel>Revenue</LegendLabel>
              <LegendDescription>
                Daily income generated from confirmed tour bookings.
              </LegendDescription>
            </LegendText>
          </LegendItem>
          <LegendItem>
            <LegendIndicator $color="#00b4d8" />
            <LegendText>
              <LegendLabel>7-Day Moving Avg</LegendLabel>
              <LegendDescription>
                Average revenue over the last 7 days to visualize trends.
              </LegendDescription>
            </LegendText>
          </LegendItem>
          <LegendItem>
            <LegendIndicator $color="#f0ad4e" />
            <LegendText>
              <LegendLabel>Bookings (×1000)</LegendLabel>
              <LegendDescription>
                Booking count scaled by 1,000 for visibility (e.g., 5k = 5
                bookings).
              </LegendDescription>
            </LegendText>
          </LegendItem>
        </LegendContainer>
      )}
    </ChartContainer>
  );
}
