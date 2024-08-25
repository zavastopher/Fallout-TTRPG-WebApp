import axios from "axios";
import { useEffect, useState } from "react";

function UserDropdown({ self, setCurrentUser }) {
  const [playerList, setPlayerList] = useState([]);
  const [options, setOptions] = useState(null);

  function updateDropdown(event) {
    var user = playerList.find((player) => {
      return player.id === event.target.value;
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
          console.log("got players");
        })
        .catch((error) => {});
    }
  }, [self]);

  return (
    <div className="dropdown-container">
      {self.isadmin ? (
        <div className="dropdown">
          <select
            id="userDropdown"
            name="userDropdown"
            onChange={updateDropdown}
          >
            <option value="none">Everything</option>
            {/*{options}*/}
            {playerList.map((player) => (
              <option key={player.id} value={JSON.stringify(player.id)}>
                {player.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default UserDropdown;
