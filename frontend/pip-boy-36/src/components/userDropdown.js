// Components
import Select from "react-select";

export function UserDropdown({
  self,
  playerList,
  playerOptions,
  dropdownStyles,
  updateCurrentUser,
}) {
  // --------------------------------------------------------
  // Members
  // --------------------------------------------------------
  // ----------------------------
  // Dropdown Styles
  // ----------------------------
  const userDDCompStyles = {
    control: (provided) => ({
      ...provided,
      fontSize: dropdownStyles.ddVars.dropdownFontSize,
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "rgb(192, 247, 168)" : "white",
    }),
    menu: (base) => ({
      ...base,
      fontSize: dropdownStyles.ddVars.dropdownFontSize,
    }),
  };

  const filteredOptions = playerOptions.filter((option) => {
    return option.value !== self.id;
  });

  // --------------------------------------------------------
  // Functions
  // --------------------------------------------------------

  function updateDropdown(event) {
    var user = playerList.find((player) => {
      return player.id === event.value;
    });

    updateCurrentUser(user && user !== undefined ? user : null);
  }

  return (
    <div className="dropdown-container">
      {self.isadmin ? (
        <div className="dropdown">
          <Select
            options={filteredOptions}
            styles={userDDCompStyles}
            theme={dropdownStyles.ddTheme}
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
