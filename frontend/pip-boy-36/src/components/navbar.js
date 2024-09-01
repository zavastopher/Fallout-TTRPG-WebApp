// Components
import { Outlet, Link } from "react-router-dom";
import { UserDropdown } from "./userDropdown";

export function Navbar({
  self,
  logMeOut,
  playerList,
  playerOptions,
  updateCurrentUser,
}) {
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
            playerList={playerList}
            playerOptions={playerOptions}
            updateCurrentUser={updateCurrentUser}
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
