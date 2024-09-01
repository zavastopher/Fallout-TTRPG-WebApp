import React from "react";
import { Item } from "./types";

type DescriptionProps = {
  currentItem: Item | null;
  currentList: string;
};

export function Description({ currentItem, currentList }: DescriptionProps) {
  return currentItem && currentItem !== null ? (
    <div>
      <h3>{currentItem ? currentItem.name : ""}</h3>
      <p>{currentItem ? currentItem.description : ""}</p>
      <p>
        {currentItem && currentItem.quantity != null
          ? `Quantity: ${currentItem.quantity}`
          : ""}
      </p>
    </div>
  ) : (
    <div>{`No ${currentList} Items`}</div>
  );
}
