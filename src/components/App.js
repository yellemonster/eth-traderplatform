import React from "react";

import NavbarBase from "./NavBarBase";
import BodyContent from "./BodyContent";

import EthContextProvider from "../_contexts/EthContext";

function App() {
  return (
    <div className="App">
      <EthContextProvider>
        <NavbarBase />
        <BodyContent />
      </EthContextProvider>
    </div>
  );
}

export default App;
