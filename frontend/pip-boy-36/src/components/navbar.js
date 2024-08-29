import { Outlet, Link } from "react-router-dom";
import UserDropdown from "./userDropdown";

function Navbar({
  self,
  currentUser,
  setCurrentUser,
  logMeOut,
  playerList,
  setPlayerList,
  resetInputs,
}) {
  //const [name, setName] = useState("");

  //console.log(`user: ${currentUser}`);

  //const name = !self.isadmin || !currentUser ? self.name : currentUser.name;

  return (
    <>
      <div className="pipboy-screen">
        <div className="header-container">
          <button type="button" className="logout" onClick={logMeOut}>
            <span>
              {"[   "}Logout{"   ]"}
            </span>
          </button>

          <UserDropdown
            self={self}
            setCurrentUser={setCurrentUser}
            playerList={playerList}
            setPlayerList={setPlayerList}
            resetInputs={resetInputs}
          ></UserDropdown>
          <div className="header-title">{self.name}</div>
        </div>
        <div className="outlet">
          <Outlet />
        </div>
        <div className="navbar-container">
          <nav className="navbar">
            <ul>
              <li>
                <Link to="/">Stats</Link>
              </li>
              <li>
                <Link to="/inventory">Inventory</Link>
              </li>
              <li>
                <Link to="/quests">Quests</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Navbar;
