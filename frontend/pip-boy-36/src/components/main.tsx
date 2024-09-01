// Libraries
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Components
import { Navbar } from "./navbar";
import { Stats } from "./stats";
import { Inventory } from "./inventory";
import { Quests } from "./quests";
import { User } from "./types";
import { MouseEventHandler } from "react";
import React from "react";

type MainProps = {
  self: User;
  currentUser: User | null;
  playerList: Array<User>;
  logMeOut: MouseEventHandler;
  updateCurrentUser: Function;
};

export function Main({
  self,
  currentUser,
  playerList,
  logMeOut,
  updateCurrentUser,
}: MainProps) {
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
      value: player,
      label: player.name,
    })),
  ];

  // --------------------------------------------------------
  // Functions
  // --------------------------------------------------------

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
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
