import { BrowserRouter, Routes, Route } from "react-router-dom";

import Stats from "./components/stats";
import Inventory from "./components/inventory";
import Quests from "./components/quests";
import Navbar from "./components/navbar";

import "./App.css";
import "./App.scss";

function App() {
  return (
    <div className="App crt crt-scanlines">
      <div id="scan"></div>
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navbar />}>
              <Route index element={<Stats />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="quests" element={<Quests />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
