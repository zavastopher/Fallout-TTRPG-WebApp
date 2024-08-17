import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./navbar";
import Stats from "./stats";
import Inventory from "./inventory";
import Quests from "./quests";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const baseURL = "http://localhost:4001";

let socket;

function Main({ self, logMeOut }) {
  const [error, setError] = useState(null);
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
    socket = io("localhost:4001");

    socket.on("connect", function () {
      socket.emit("my event", { data: "I'm connected!" });
    });

    socket.on("message", () => {
      console.log("connected!");
    });

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
  }, [limbsHurt]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar self={self} logMeOut={logMeOut} />}>
          <Route index element={<Stats hp={self.hp} limbsHurt={limbsHurt} />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="questss" element={<Quests />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
