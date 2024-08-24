import { Outlet } from "react-router-dom";

function ContextMenu(submitFunciton) {
  return (
    <div className="context-menu-container context-open">
      <div className="context-toggle-button">
        <span>+</span>
      </div>
      <div className="context-menu">
        <Outlet></Outlet>
        <button onClick={submitFunciton} className="context-submit">
          Submit
        </button>
      </div>
    </div>
  );
}

export default ContextMenu;
