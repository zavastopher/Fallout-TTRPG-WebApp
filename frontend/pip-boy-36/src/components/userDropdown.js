import axios from "axios";
import { useEffect } from "react";
import Select from "react-select";

function UserDropdown({
  self,
  setCurrentUser,
  playerList,
  setPlayerList,
  resetInputs,
}) {
  const blackTransColor = "rgba(0, 0, 0, .75)";
  const greenTransColor = "rgba(0, 128, 0, .75)";

  const dropdownFontSize = "16px";

  const options = [
    { value: null, label: "none" },
    ...playerList.map((player) => ({
      value: player.personid,
      label: player.name,
    })),
  ];

  const filterdOptions = options.filter((option) => {
    return option.value !== self.id;
  });

  //const options = [
  //  { value: "chocolate", label: "Chocolate" },
  //  { value: "strawberry", label: "Strawberry" },
  //  { value: "vanilla", label: "Vanilla" },

  //];

  const colorStyles = {
    control: (provided) => ({
      ...provided,
      fontSize: dropdownFontSize,
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "rgb(192, 247, 168)" : "white",
    }),
    menu: (base) => ({
      ...base,
      fontSize: dropdownFontSize,
    }),
    //menuList: (baseStyles, state) => ({
    //  ...baseStyles,
    //  background: "rgba(0, 0, 0, 0)",
    //}),
  };

  const customTheme = (theme) => ({
    ...theme,
    fontSize: "16px",
    colors: {
      ...theme.colors,
      primary25: greenTransColor, // change Background color of options on hover
      primary: greenTransColor, // change the Background color of the selected option
      neutral0: blackTransColor,
      neutral5: "black",
      neutral10: "black",
      neutral20: "black",
      neutral30: greenTransColor, // Border Hover Color
      neutral40: "green", // Arrow Hover Color
      neutral50: "green", // Select text
      neutral60: greenTransColor, //
      neutral70: greenTransColor, //
      neutral80: greenTransColor, //
      neutral90: greenTransColor, //
    },
  });

  function updateDropdown(event) {
    resetInputs();

    var user = playerList.find((player) => {
      return player.personid === event.value;
    });

    setCurrentUser(user && user !== undefined ? user : null);
  }

  //  useEffect(() => {
  //    console.log(playerList);

  //    var options = playerList.map((player) => (
  //      <option key={player.id} value={player.id}>
  //        {player.name}
  //      </option>
  //    ));

  //    setOptions(options);
  //  }, [playerList]);

  useEffect(() => {
    if (self.isadmin) {
      // Add axios call
      axios
        .get(`${process.env.REACT_APP_BASEURL}/players`, {})
        .then((response) => {
          setPlayerList([...response.data]);
        })
        .catch((error) => {});
    }
  }, [self, setPlayerList]);

  return (
    <div className="dropdown-container">
      {self.isadmin ? (
        <div className="dropdown">
          {/*<select
            id="userDropdown"
            name="userDropdown"
            onChange={updateDropdown}
          >
            <option value="none">Everything</option>
            {playerList.map((player) => (
              <option key={player.id} value={JSON.stringify(player.id)}>
                {player.name}
              </option>
            ))}
          </select>*/}

          <Select
            options={filterdOptions}
            styles={colorStyles}
            theme={customTheme}
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

export default UserDropdown;
