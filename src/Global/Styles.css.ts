import styled, { createGlobalStyle, css } from "styled-components";

const CSSGlobal = createGlobalStyle`
:root {
  &, &.light-mode {
    /* Grey */
    --color-grey-0: #fff;
    --color-grey-50: #f9fafb;
    --color-grey-100: #f3f4f6;
    --color-grey-200: #e5e7eb;
    --color-grey-300: #d1d5db;
    --color-grey-400: #9ca3af;
    --color-grey-500: #6b7280;
    --color-grey-600: #4b5563;
    --color-grey-700: #374151;
    --color-grey-800: #1f2937;
    --color-grey-900: #111827;

    --color-blue-100: #e0f2fe;
    --color-blue-700: #0369a1;
    --color-green-100: #dcfce7;
    --color-green-700: #15803d;
    --color-yellow-100: #fef9c3;
    --color-yellow-700: #a16207;
    --color-silver-100: #e5e7eb;
    --color-silver-700: #374151;
    --color-indigo-100: #e0e7ff;
    --color-indigo-700: #4338ca;

    --color-red-100: #fee2e2;
    --color-red-700: #b91c1c;
    --color-red-800: #991b1b;

    --backdrop-color: rgba(0, 0, 0, 0.5);

    --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
    

    --image-grayscale: 0;
    --image-opacity: 100%;
  }
  
  &.dark-mode {
    --color-grey-0: #18212f;
    --color-grey-50: #111827;
    --color-grey-100: #1f2937;
    --color-grey-200: #374151;
    --color-grey-300: #4b5563;
    --color-grey-400: #6b7280;
    --color-grey-500: #9ca3af;
    --color-grey-600: #d1d5db;
    --color-grey-700: #e5e7eb;
    --color-grey-800: #f3f4f6;
    --color-grey-900: #f9fafb;

    --color-blue-100: #075985;
    --color-blue-700: #e0f2fe;
    --color-green-100: #166534;
    --color-green-700: #dcfce7;
    --color-yellow-100: #854d0e;
    --color-yellow-700: #fef9c3;
    --color-silver-100: #374151;
    --color-silver-700: #f3f4f6;
    --color-indigo-100: #3730a3;
    --color-indigo-700: #e0e7ff;

    --color-red-100: #fee2e2;
    --color-red-700: #b91c1c;
    --color-red-800: #991b1b;

    --backdrop-color: rgba(0, 0, 0, 0.3);

    --image-grayscale: 10%;
    --image-opacity: 90%;
  }
  
    /* Green (Natours brand) adjusted to Design System standards */
    --color-brand-50: #f7fcf9;
    --color-brand-100: #dcfce7;
    --color-brand-200: #bbf7d0;
    --color-brand-300: #7ed56f; /* Logo Light */
    --color-brand-500: #28b485; /* Logo Dark / Action */
    --color-brand-600: #228b66;
    --color-brand-700: #1a6b4e;
    --color-brand-800: #14523d;
    --color-brand-900: #0f3d2e;

    --color-danger-light: #fef2f2; 
    --color-danger-base: #bb2124;  
    --color-danger-dark: #991b1b;

    --color-success-light: #e6f7f0; /* Very soft brand tint for backgrounds */
    --color-success-base: #22bb33;  /* The main brand action green */
    --color-success-dark: #1b8a29;  /* Deep forest green for text contrast */
  
  /* Red */
  --color-red-500: rgb(239 68 68);

  /* Zinc */
  --color-zinc-100: rgb(244 244 245);
  --color-zinc-300: rgb(212 212 216);

  --border-radius-tiny: 3px;
  --border-radius-sm: 5px;
  --border-radius-md: 7px;
  --border-radius-lg: 9px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;

  /* Smooth transitions for theme switching */
  transition: background-color 0.3s ease, border 0.3s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

html {
  /* 1rem = 10px for easier calculations */
  font-size: 62.5%;
  
  /* Smooth scrolling */
  scroll-behavior: smooth;
  
  @media (prefers-reduced-motion: reduce) {
    scroll-behavior: auto;
  }
}

body {
  font-family: "Nunito Sans", "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--color-grey-700);
  background-color: var(--color-grey-50);

  transition: color 0.3s ease, background-color 0.3s ease;
  min-height: 100vh;
  line-height: 1.5;
  font-size: 1.6rem;
  
  /* Better text rendering */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* Prevent text size adjustment on mobile */
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
  user-select: none;
  
  /* Better tap feedback on mobile */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

*:disabled {
  cursor: not-allowed;
}

select:disabled,
input:disabled {
  background-color: var(--color-grey-200);
  color: var(--color-grey-500);
}

input:focus,
button:focus,
textarea:focus,
select:focus {
  outline: 2px solid var(--color-brand-300);
  outline-offset: -2px;
}

/* Parent selector */
button:has(svg) {
  line-height: 0;
}

a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

ul {
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  hyphens: auto;
}

img {
  max-width: 100%;
  height: auto;
  display: block;

  /* For dark mode */
  filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
  
  transition: filter 0.3s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.toast-container {
  @media (max-width: 768px) {
    /* Position at bottom on mobile for better reachability */
/*    bottom: 2rem !important;
    top: auto !important;
  }
}

.toast-container > div {
  @media (max-width: 768px) {
    font-size: 1.5rem !important;
    max-width: calc(100vw - 3.2rem) !important;
    padding: 1.4rem 2rem !important;
    margin: 0 1.6rem !important;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem !important;
    padding: 1.2rem 1.6rem !important;
  }
}

/* Improved focus visibility */
:focus-visible {
  outline: 2px solid var(--color-brand-300);
  outline-offset: 2px;
}

/* Better scrollbar styling */
::-webkit-scrollbar {
  width: 1rem;
  height: 1rem;
}

::-webkit-scrollbar-track {
  background: var(--color-grey-100);
}

::-webkit-scrollbar-thumb {
  background: var(--color-grey-400);
  border-radius: 1rem;
  
  &:hover {
    background: var(--color-grey-500);
  }
}

/* Selection styling */
::selection {
  background-color: var(--color-brand-200);
  color: var(--color-grey-900);
}

/* Mobile-specific styles */
@media (max-width: 768px) {
  body {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  body {
    font-size: 1.4rem;
  }
}
`;

export const LayoutRow = styled.div<{
  $flex?: { alignItems?: string; justifyContent?: string };
  $type?: "horizontal" | "vertical";
}>`
  display: flex;
  flex-wrap: wrap;
  transition: all 0.2s ease;

  ${(props) =>
    props.$type === "horizontal" &&
    css`
      align-items: center;
      justify-content: ${props.$flex?.justifyContent
        ? props.$flex.justifyContent
        : "space-between"};
      gap: 1.6rem;

      /* Stack on mobile */
      @media (max-width: 768px) {
        flex-direction: column;
        align-items: ${props.$flex?.alignItems
          ? props.$flex.alignItems
          : "stretch"};
        gap: 1.2rem;
      }
    `}

  ${(props) =>
    props.$type === "vertical" &&
    css`
      align-items: ${props.$flex?.alignItems
        ? props.$flex.alignItems
        : "stretch"};
      flex-direction: column;
      gap: 1.6rem;

      @media (max-width: 768px) {
        gap: 1.2rem;
      }

      @media (max-width: 480px) {
        gap: 1rem;
      }
    `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

LayoutRow.defaultProps = {
  $type: "vertical",
};

export default CSSGlobal;
