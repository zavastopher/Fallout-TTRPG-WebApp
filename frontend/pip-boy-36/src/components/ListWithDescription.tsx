import React from "react";
import { Description } from "./description";
import { List } from "./list";
import { Item } from "./types";

type ListWithDescriptionProps = {
  selected: number;
  setSelected: Function;
  deleteItemHandler: Function;
  shouldDelete: Boolean;
  currentList: string;
  filteredList: Array<Item>;
  filterText: string;
  setFilterText: Function;
};

export function ListWithDescription({
  selected,
  setSelected,
  deleteItemHandler,
  shouldDelete,
  currentList,
  filteredList,
  filterText,
  setFilterText,
}: ListWithDescriptionProps) {
  // --------------------------------------------------------
  // Members
  // --------------------------------------------------------
  const currentItem: Item | null = filteredList ? filteredList[selected] : null;

  return (
    <div id={currentList.toLowerCase()} className="list-container">
      <List
        selected={selected}
        setSelected={setSelected}
        deleteItemHandler={() =>
          currentItem
            ? deleteItemHandler(currentItem)
            : console.log("Could not delete")
        }
        shouldDelete={shouldDelete}
        filteredList={filteredList}
        filterText={filterText}
        setFilterText={setFilterText}
      ></List>
      <div className={`${currentList.toLowerCase()}-description description`}>
        <Description
          currentItem={currentItem}
          currentList={currentList}
        ></Description>
      </div>
    </div>
  );
}
