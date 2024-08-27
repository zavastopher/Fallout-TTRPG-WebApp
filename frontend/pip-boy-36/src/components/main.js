import { BrowserRouter, Route, Routes } from "react-router-dom";
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
  const [currentUser, setCurrentUser] = useState(null);
  const [playerList, setPlayerList] = useState([]);
  const [inputs, setInputs] = useState({});

  const playerOptions = [
    { value: null, label: "none" },
    ...playerList.map((player) => ({
      value: player.personid,
      label: player.name,
    })),
  ];

  // Dropdown styles
  const ddStyles = {
    blackTransColor: "rgba(0, 0, 0, .75)",
    greenTransColor: "rgba(0, 128, 0, .75)",
    dropdownFontSize: "16px",
  };

  const customTheme = (theme) => ({
    ...theme,
    fontSize: "16px",
    colors: {
      ...theme.colors,
      primary25: ddStyles.greenTransColor, // change Background color of options on hover
      primary: ddStyles.greenTransColor, // change the Background color of the selected option
      neutral0: ddStyles.blackTransColor,
      neutral5: "black",
      neutral10: "black",
      neutral20: "black",
      neutral30: ddStyles.greenTransColor, // Border Hover Color
      neutral40: "green", // Arrow Hover Color
      neutral50: "green", // Select text
      neutral60: ddStyles.greenTransColor, //
      neutral70: ddStyles.greenTransColor, //
      neutral80: ddStyles.greenTransColor, //
      neutral90: ddStyles.greenTransColor, //
    },
  });

  const colorStyles = {
    control: (provided) => ({
      ...provided,
      fontSize: ddStyles.dropdownFontSize,
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "rgb(192, 247, 168)" : "white",
    }),
    menu: (base) => ({
      ...base,
      fontSize: ddStyles.dropdownFontSize,
      position: "absolute",
      right: "0",
      overflow: "visible",
    }),
    menuList: (base) => ({
      ...base,
      position: "absolute",
      bottom: "46px",
      backgroundColor: ddStyles.blackTransColor,
      width: "inherit",
    }),
  };

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  function resetInputs() {
    setInputs({});
  }

  useEffect(() => {
    // Get Limbs
    if (self) {
      if (self.isadmin) {
      } else {
        axios
          .get(`${process.env.REACT_APP_BASEURL}/players/limbs/${self.id}`, {})
          .then((response) => {
            console.log(response.data);
            console.log(response.data[self.name]);

            var hurtLimbs = response.data[self.name];
            setLimbsHurt(hurtLimbs);
            console.log("pause");
          });
      }
    }
  }, [self]);

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
        <Route
          path="/"
          element={
            <Navbar
              self={self}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              logMeOut={logMeOut}
              playerList={playerList}
              setPlayerList={setPlayerList}
              resetInputs={resetInputs}
            />
          }
        >
          <Route
            index
            element={
              <Stats
                hp={currentUser ? currentUser.hp : self.hp}
                maxhp={currentUser ? currentUser.maxhp : self.maxhp}
                limbsHurt={limbsHurt}
              />
            }
          />
          <Route
            path="inventory"
            element={
              <Inventory
                self={self}
                currentUser={currentUser}
                playerOptions={playerOptions}
                inputs={inputs}
                setInputs={setInputs}
                resetInputs={resetInputs}
                customTheme={customTheme}
                colorStyles={colorStyles}
                handleInputChange={handleInputChange}
              />
            }
          />
          <Route
            path="quests"
            element={
              <Quests
                self={self}
                currentUser={currentUser}
                playerOptions={playerOptions}
                inputs={inputs}
                setInputs={setInputs}
                resetInputs={resetInputs}
                customTheme={customTheme}
                colorStyles={colorStyles}
                handleInputChange={handleInputChange}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
