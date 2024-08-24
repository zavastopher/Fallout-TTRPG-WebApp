import { Outlet } from "react-router-dom";

function ContextMenu() {
  return (
    <div className="context-menu-container">
      <div className="context-menu">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
