import { Outlet, Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
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
    </>
  );
};

export default Navbar;
