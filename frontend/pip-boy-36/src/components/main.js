import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./navbar";
import Stats from "./stats";
import Inventory from "./inventory";
import Quests from "./quests";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

let socket;

function Main({ self, refreshSelf, logMeOut }) {
  const [limbsHurt, setLimbsHurt] = useState(null);
  
  //function updateLimb(limbs, status) {}

  useEffect(() => {
    // Get Limbs
    if (self) {
      axios.get(`${process.env.REACT_APP_BASEURL}/players/limbs/${self.id}`, {}).then((response) => {
        console.log(response.data);
        console.log(response.data[self.name]);
  
        var hurtLimbs = response.data[self.name];
        setLimbsHurt(hurtLimbs);
        console.log("pause");
      });
    }
  }, [])
  
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
      refreshSelf();
    });

    socket.on("limb", (limb, status) => {
      limbsHurt[limb] = status;
    });

    // when component unmounts, disconnect
    return () => {
      socket.disconnect();
    };
  }, [limbsHurt, refreshSelf]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar self={self} logMeOut={logMeOut} />}>
          <Route index element={<Stats hp={self.hp} limbsHurt={limbsHurt} />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="quests" element={<Quests />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
