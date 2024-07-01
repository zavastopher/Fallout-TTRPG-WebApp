import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./navbar";
import Stats from "./stats";
import Inventory from "./inventory";
import Quests from "./quests";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

function Main() {
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Stats hp={hp} limbsHurt={limbsHurt} />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="quests" element={<Quests />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
