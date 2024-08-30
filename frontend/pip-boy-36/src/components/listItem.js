import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

function ListItem({
  item,
  itemIndex,
  clickEvent,
  currentItem,
  deleteItem,
  shouldDelete,
}) {
  return (
    <li
      className={`list-item ${currentItem === itemIndex ? "selected" : ""}`}
      id={`item${itemIndex}`}
    >
      <div className="list-item-container" onClick={clickEvent}>
        {item.name}
      </div>

      {shouldDelete ? (
        <FontAwesomeIcon
          className="remove-icon"
          icon={faTrashCan}
          onClick={deleteItem}
        />
      ) : (
        <div></div>
      )}
    </li>
  );
}

export default ListItem;
