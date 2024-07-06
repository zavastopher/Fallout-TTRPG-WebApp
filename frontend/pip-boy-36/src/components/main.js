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

  const [error, setError] = useState(null);

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

  useEffect(() => {
    // invalid url will trigger an 404 error
    console.log(`${baseURL}`);

    axios
      .get(`${baseURL}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log("test");
        console.log("test thing");
      })
      .catch((error) => {
        setError(error);
        console.log(error);
      });
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
