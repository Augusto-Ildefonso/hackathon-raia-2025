import React from "react";
import ModernChatContainer from "./components/ModernChatContainer.jsx";
import { SocketProvider } from "./contexts/SocketContext.jsx";
import "./App.css";

function App() {
  return (
    <SocketProvider>
      <ModernChatContainer />
    </SocketProvider>
  );
}

export default App;
