// Libraries
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Components
import { Navbar } from "./navbar";
import { Stats } from "./stats";
import { Inventory } from "./inventory";
import { Quests } from "./quests";

export function Main({
  self,
  currentUser,
  playerList,
  logMeOut,
  updateCurrentUser,
  userBools,
}) {
  // --------------------------------------------------------
  // Members
  // --------------------------------------------------------

  /**
   * Cached list of players placed into an options list that is readable by
   * the React Select library.
   */
  const playerOptions = [
    { value: null, label: "none" },
    ...playerList.map((player) => ({
      value: player.id,
      label: player.name,
    })),
  ];

  // ----------------------------
  // Dropdown Styles
  // ----------------------------
  const ddVars = {
    blackTransColor: "rgba(0, 0, 0, .75)",
    greenTransColor: "rgba(0, 128, 0, .75)",
    dropdownFontSize: "16px",
  };

  const ddThemeStyles = (theme) => ({
    ...theme,
    fontSize: "16px",
    colors: {
      ...theme.colors,
      primary25: ddVars.greenTransColor, // change Background color of options on hover
      primary: ddVars.greenTransColor, // change the Background color of the selected option
      neutral0: ddVars.blackTransColor,
      neutral5: "black",
      neutral10: "black",
      neutral20: "black",
      neutral30: ddVars.greenTransColor, // Border Hover Color
      neutral40: "green", // Arrow Hover Color
      neutral50: "green", // Select text
      neutral60: ddVars.greenTransColor, //
      neutral70: ddVars.greenTransColor, //
      neutral80: ddVars.greenTransColor, //
      neutral90: ddVars.greenTransColor, //
    },
  });

  const ddCompStyles = {
    control: (provided) => ({
      ...provided,
      fontSize: ddVars.dropdownFontSize,
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "rgb(192, 247, 168)" : "white",
    }),
    menu: (base) => ({
      ...base,
      fontSize: ddVars.dropdownFontSize,
      position: "absolute",
      right: "0",
      overflow: "visible",
    }),
    menuList: (base) => ({
      ...base,
      position: "absolute",
      bottom: "46px",
      backgroundColor: ddVars.blackTransColor,
      width: "inherit",
    }),
  };

  const dropdownStyles = {
    ddVars: ddVars,
    ddTheme: ddThemeStyles,
    ddComp: ddCompStyles,
  };

  // --------------------------------------------------------
  // Functions
  // --------------------------------------------------------

  const handleInputChange = (event, setInputs) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navbar
              self={self}
              logMeOut={logMeOut}
              playerList={playerList}
              playerOptions={playerOptions}
              // resetInputs={resetInputs}
              dropdownStyles={dropdownStyles}
              updateCurrentUser={updateCurrentUser}
            />
          }
        >
          <Route
            index
            element={
              <Stats
                hp={currentUser ? currentUser.hp : self.hp}
                maxhp={currentUser ? currentUser.maxhp : self.maxhp}
                limbsHurt={currentUser ? currentUser.limbsHurt : self.limbsHurt}
                self={self}
                currentUser={currentUser}
                userBools={userBools}
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
                // inputs={inputs}
                // setInputs={setInputs}
                // resetInputs={resetInputs}
                dropdownStyles={dropdownStyles}
                handleInputChange={handleInputChange}
                key={currentUser ? currentUser.id : -1}
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
                // inputs={inputs}
                // setInputs={setInputs}
                // resetInputs={resetInputs}
                dropdownStyles={dropdownStyles}
                handleInputChange={handleInputChange}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
