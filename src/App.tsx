import { FC, ReactNode } from "react";

import CSSGlobal from "./global.css";

const App: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="App">
      <CSSGlobal />

      {children}
    </div>
  );
};

export default App;
