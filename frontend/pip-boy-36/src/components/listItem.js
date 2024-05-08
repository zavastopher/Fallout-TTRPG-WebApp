function ListItem({ item, itemIndex, clickEvent, currentItem }) {
  return (
    <li
      className={`list-item ${currentItem === itemIndex ? "selected" : ""}`}
      id={`item${itemIndex}`}
    >
      <div className="list-item-container" onClick={clickEvent}>
        {item.name}
      </div>
    </li>
  );
}

export default ListItem;
