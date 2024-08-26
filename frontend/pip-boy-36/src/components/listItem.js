import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

function ListItem({ item, itemIndex, clickEvent, currentItem, deleteItem }) {
  return (
    <li
      className={`list-item ${currentItem === itemIndex ? "selected" : ""}`}
      id={`item${itemIndex}`}
    >
      <div className="list-item-container" onClick={clickEvent}>
        {item.name}
      </div>

      <FontAwesomeIcon
        className="remove-icon"
        icon={faTrashCan}
        onClick={deleteItem}
      />
    </li>
  );
}

export default ListItem;
