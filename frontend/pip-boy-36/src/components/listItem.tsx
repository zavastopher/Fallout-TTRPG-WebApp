// Libraries
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import React from "react";
import { Item } from "./types";

type ListItemProps = {
  item: Item;
  itemIndex: number;
  currentItem: number;
  clickEvent: React.MouseEventHandler<HTMLDivElement>;
  deleteItemHandler: React.MouseEventHandler<SVGSVGElement>;
  shouldDelete: Boolean;
};

export function ListItem({
  item,
  itemIndex,
  clickEvent,
  currentItem,
  deleteItemHandler,
  shouldDelete,
}: ListItemProps) {
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
          onClick={deleteItemHandler}
        />
      ) : (
        <div></div>
      )}
    </li>
  );
}
