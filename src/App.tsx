import { FC, ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import CSSGlobal from "src/Global/Styles.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60 * 60 * 1000 } },
});

const App: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <CSSGlobal />

        {children}
      </div>

      <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
