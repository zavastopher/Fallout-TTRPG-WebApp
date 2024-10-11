import React from "react";
import { ListItemType } from "./types";

type DescriptionProps = {
  currentItem: ListItemType | null;
  currentList: string;
};

export function Description({ currentItem, currentList }: DescriptionProps) {
  return currentItem && currentItem !== null ? (
    <div>
      <h3>{currentItem ? currentItem.name : ""}</h3>
      <p>{currentItem ? currentItem.description : ""}</p>
    </div>
  ) : (
    <div>{`No ${currentList} Items`}</div>
  );
}
