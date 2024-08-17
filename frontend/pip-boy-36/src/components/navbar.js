import { Outlet, Link } from "react-router-dom";

const Navbar = ({ self, logMeOut }) => {
  return (
    <>
      <div className="pipboy-screen">
        <div className="header-container">
          <button type="button" className="logout" onClick={logMeOut}>
            <span>
              {"[ "}Logout{" ]"}
            </span>
          </button>
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
};

export default Navbar;
