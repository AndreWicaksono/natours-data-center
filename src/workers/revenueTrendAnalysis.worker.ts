// console.log("🟢 Revenue Trend Analysis Worker: Initializing...");

interface RawDataItem {
  date: string;
  revenue: number;
  bookings: number;
}

interface TransformedDataItem {
  x: string;
  y: number;
}

interface TransformedSeries {
  id: string;
  data: TransformedDataItem[];
}

interface WorkerMessage {
  type: string;
  data?: RawDataItem[];
  id?: string;
  result?: TransformedSeries[];
  executionTime?: number;
  error?: string;
}

// Heavy data transformation function
function transformRevenueData(rawData: RawDataItem[]): TransformedSeries[] {
  // console.log("🟢 Worker: Starting transformation of", rawData.length, "items");

  // Simulate complex transformation with intentional delay
  // BLOCKING: Force the worker thread to hang for 1.5 seconds to demonstrate the offloading
  const start = performance.now();
  while (performance.now() - start < 3000) {
    // Busy wait to simulate heavy calculation
  }

  // Transform data into Nivo Line format
  const revenueData: TransformedDataItem[] = rawData.map((item) => ({
    x: item.date,
    y: item.revenue,
  }));

  const bookingsData: TransformedDataItem[] = rawData.map((item) => ({
    x: item.date,
    y: item.bookings * 1000,
  }));

  // Calculate moving average (7-day)
  const movingAvg: TransformedDataItem[] = [];
  for (let i = 6; i < rawData.length; i++) {
    const sum = rawData
      .slice(i - 6, i + 1)
      .reduce((acc, item) => acc + item.revenue, 0);
    movingAvg.push({
      x: rawData[i].date,
      y: sum / 7,
    });
  }

  const result: TransformedSeries[] = [
    { id: "Revenue", data: revenueData },
    { id: "7-Day Moving Avg", data: movingAvg },
    { id: "Bookings (×1000)", data: bookingsData },
  ];

  // console.log("🟢 Worker: Transformation completed!");
  return result;
}

// Worker message handler
self.addEventListener("message", function (event: MessageEvent<WorkerMessage>) {
  try {
    const { type, data, id } = event.data;
    // console.log("🟢 Worker: Received message type:", type);

    if (type === "TRANSFORM_REVENUE" && data) {
      const startTime = performance.now();
      const result = transformRevenueData(data);
      const endTime = performance.now();

      self.postMessage({
        type: "RESULT",
        result: result,
        id: id,
        executionTime: endTime - startTime,
      } as WorkerMessage);
    }
  } catch (error) {
    // console.error("🔴 Worker: Error during transformation:", error);
    self.postMessage({
      type: "ERROR",
      error: (error as Error).message,
      id: event.data.id,
    } as WorkerMessage);
  }
});

// Send ready signal
// console.log("🟢 Revenue Trend Analysis Worker: Ready!");
self.postMessage({ type: "READY" } as WorkerMessage);
