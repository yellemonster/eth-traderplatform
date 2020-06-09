import React from "react";

import NavbarBase from "./components/NavBarBase";
import BodyContent from "./components/BodyContent";

import EthContextProvider from "./_contexts/EthContext";

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
