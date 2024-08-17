import { Outlet, Link } from "react-router-dom";
import axios from "axios";

var baseURL = "http://localhost";

const Navbar = ({ removeToken }) => {
  const logout = () => {
    axios
      .post(`${baseURL}/api/logout`, {})
      .then((response) => {
        console.log(response.data);
        removeToken();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="pipboy-screen">
        <div className="header-container">
          <button type="button" className="logout" onClick={logout}>
            <span>
              {"[ "}Logout{" ]"}
            </span>
          </button>
          <div className="header-title">Name</div>
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
