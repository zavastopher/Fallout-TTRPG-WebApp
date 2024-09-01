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
                handleInputChange={handleInputChange}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
