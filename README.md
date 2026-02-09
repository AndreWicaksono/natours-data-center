<div align="center">
  <img src="public/SVG/favicon.svg" alt="Natours Data Center Logo" width="120" height="120" />
  <h1>Natours Data Center</h1>

[![Netlify Status](https://api.netlify.com/api/v1/badges/67147bde-52a8-4377-a2c9-03d56cbdbbe5/deploy-status)](https://app.netlify.com/sites/ndc-andre-wicaksono/deploys)
[![CircleCI](https://dl.circleci.com/status-badge/img/circleci/38jLTJ71QLactquHziSNdc/UTFVyX7hsceqbN4QnUXtfB/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/38jLTJ71QLactquHziSNdc/UTFVyX7hsceqbN4QnUXtfB/tree/main)

<br />

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![TanStack Router](https://img.shields.io/badge/TanStack%20Router-FF4154?style=for-the-badge&logo=reactrouter&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)

</div>

---

## Overview

Natours Data Center was created using Natours product ideas from Udemy courses: [Advanced CSS and Sass: Flexbox, Grid, Animations and More!](https://www.udemy.com/course/advanced-css-and-sass/) (by [Jonas Schmedtmann](https://www.udemy.com/course/advanced-css-and-sass/#instructor-1)). And for the UI design, it uses The Wild Oasis project from [The Ultimate React Course 2023: React, Redux & More](https://www.udemy.com/course/the-ultimate-react-course/) (by [Jonas Schmedtmann](https://www.udemy.com/course/advanced-css-and-sass/#instructor-1)).

## Tech Stack

### Core Framework & Language

- **Vite** – Next Generation Frontend Tooling for fast development and optimized builds.
- **React 18** – A JavaScript library for building user interfaces.
- **TypeScript** – Strongly typed programming language that builds on JavaScript.

### Routing & State Management

- **TanStack Router** – Type-safe routing for React applications.
- **TanStack Query (React Query)** – Powerful asynchronous state management for data fetching, caching, and synchronization.

### Styling & UI

- **Styled Components** – Visual primitives for the component age.
- **Nivo** – Rich, interactive data visualization components for React.
- **Heroicons** – Beautiful, hand-crafted SVG icons.

## 📊 Revenue Trend Analysis Feature

This project includes a sophisticated demonstration of **Performance Optimization** using Web Workers to handle heavy data visualization tasks.

### Technical Architecture

#### 1. `RevenueTrendChart.tsx` (The UI)

A React component that visualizes complex revenue data using **Nivo Charts**. It implements a "Hybrid Rendering Strategy":

- **Worker Mode (Default)**: Offloads data transformation to a background thread.
- **Sync Mode (Blocking)**: Runs transformation on the main thread to demonstrate UI freezing.
- **Progressive Painting**: Renders the chart line-by-line (chunking) to prevent frame drops during the render phase.

#### 2. `revenueTrendAnalysis.worker.ts` (The Brain)

A dedicated Web Worker that handles the "heavy lifting":

- **Simulation**: Intentionally blocks execution for **3000ms** to simulate processing millions of records.
- **Calculations**: Computes 7-day moving averages and data normalization.
- **Isolation**: Runs completely separate from the UI thread, ensuring buttons and animations remain smooth.

---

### 🧪 User Test Case: The "Freeze" Test

To truly appreciate the performance difference, follow this test flow:

#### Step 1: Test the Non-Blocking Worker (Good UX)

1.  Locate the **"Interaction Check"** panel in the chart header.
2.  Click the **"Process with Worker"** button.
3.  **Immediately** start clicking the **"Test Clicks: 0"** counter button rapidly.
4.  **Result**: You will see the counter increment (`1, 2, 3...`) _while_ the "Processing..." spinner is spinning. The UI remains alive.

#### Step 2: Test the Blocking Synchronous Mode (Bad UX)

1.  Click the **"Run on Main Thread (Blocking)"** button.
2.  **Immediately** try to click the **"Test Clicks: 0"** counter button.
3.  **Result**: The button **will not respond**. The hover effects will freeze. The counter will not update until the 3-second processing is finished.

---

### 📈 How to Read the Graph

- **Green Line (Revenue)**: Represents the raw daily income from confirmed bookings.
- **Blue Line (7-Day Avg)**: A calculated moving average to show the underlying trend direction, smoothing out daily volatility.
- **Orange Line (Bookings)**: The number of daily bookings. _Note: This value is scaled by 1,000 (e.g., 5K on axis = 5 bookings) to fit visually alongside revenue figures._

---

### ⚙️ Web Worker Configuration Guide

To ensure the Web Worker (`revenueTrendAnalysis.worker.ts`) functions correctly within the Vite + TypeScript ecosystem, the following configurations are essential:

#### 1. `vite.config.ts`

```ts
worker: {
  format: 'es',
}
```

**Why:** Configures Vite to bundle workers as standard **ES Modules** instead of the default IIFE. This is crucial for modern development as it allows the worker to use `import`/`export` syntax, enabling code sharing between the main thread and the worker.

#### 2. `vite-env.d.ts`

```ts
/// <reference types="vite/client" />
```

**Why:** This directive brings in Vite's client-side type definitions. It specifically allows TypeScript to understand that imports ending in `?worker` (e.g., `import Worker from './file?worker'`) return a Worker constructor.

#### 3. `tsconfig.json`

```json
"types": ["vite/client", "node"]
```

**Why:**

- `"vite/client"`: Global type definitions for Vite features (like `import.meta.env`).
- `"node"`: Necessary for configuration files (like `vite.config.ts`) that run in a Node.js environment, preventing errors when using globals like `process.cwd()`.
