// Components
import Select from "react-select";
import { User, UserOption } from "./types";
import { ddTheme, userDDStyles } from "./styles";
import React from "react";

type UserDropdownProps = {
  self: User;
  playerList: Array<User>;
  playerOptions: UserOption[];
  updateCurrentUser: Function;
};

export function UserDropdown({
  self,
  playerList,
  playerOptions,
  updateCurrentUser,
}: UserDropdownProps) {
  // --------------------------------------------------------
  // Members
  // --------------------------------------------------------
  // ----------------------------
  // Dropdown Styles
  // ----------------------------

  const filteredOptions = playerOptions.filter((option) => {
    return option.value.id !== self.id;
  });

  // --------------------------------------------------------
  // Functions
  // --------------------------------------------------------

  function updateDropdown(option: UserOption | null) {
    var user = playerList.find((player) => {
      return player.id === option?.value.id;
    });

    updateCurrentUser(user && user !== undefined ? user : null);
  }

  return (
    <div className="dropdown-container">
      {self.isadmin ? (
        <div className="dropdown">
          <Select
            options={filteredOptions}
            styles={userDDStyles}
            theme={ddTheme}
            isMulti={false}
            onChange={updateDropdown}
            defaultValue={null}
          />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
