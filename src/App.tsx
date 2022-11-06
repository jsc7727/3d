import React from "react";
import logo from "./logo.svg";
import "./App.css";
import BoxMove1 from "./pages/BoxMove1";
import BoxMove2 from "./pages/BoxMove2";
import BoxMove3 from "./pages/BoxMove3";
import MineCraft from "./pages/MineCraft";
import Chat from "./components/Chat/Chat";
import Player2 from "./components/MineCraft/Player2";

function App() {
  return (
    <div className="App">
      {/* <BoxMove1></BoxMove1> */}
      {/* <BoxMove2></BoxMove2> */}
      {/* <BoxMove3></BoxMove3> */}
      <MineCraft></MineCraft>
      {/* <Chat></Chat> */}
    </div>
  );
}

export default App;
