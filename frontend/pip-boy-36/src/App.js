import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

import Stats from "./components/stats";
import Inventory from "./components/inventory";
import Quests from "./components/quests";
import Navbar from "./components/navbar";

import "./App.css";
import "./App.scss";

let socket;

function App() {
  const [hp, setHP] = useState(90);

  const [limbsHurt, setLimbsHurt] = useState({
    head: true,
    torso: false,
    leftArm: false,
    rightArm: false,
    leftLeg: false,
    rightLeg: false,
  });

  function updateLimb(limbs, status) {}

  useEffect(() => {
    // create websocket/connect
    socket = io();

    socket.on("hp", (hp) => {
      setHP(hp);
    });

    socket.on("limb", (limb, status) => {
      limbsHurt[limb] = status;
    });

    // when component unmounts, disconnect
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App crt crt-scanlines">
      <div id="scan"></div>
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navbar />}>
              <Route index element={<Stats hp={hp} limbsHurt={limbsHurt} />} />
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
