// Libraries
import $ from "jquery";
import { useCallback, useEffect } from "react";

// Components
import { ListItem } from "./listItem";
import React from "react";
import { Item } from "./types";

type ListProps = {
  selected: number;
  setSelected: Function;
  filteredList: Array<Item>;
  filterText: string;
  setFilterText: Function;
  deleteItemHandler: React.MouseEventHandler<SVGSVGElement>;
  shouldDelete: Boolean;
};

export function List({
  selected,
  setSelected,
  filteredList,
  filterText,
  setFilterText,
  deleteItemHandler,
  shouldDelete,
}: ListProps) {
  // --------------------------------------------------------
  // Members
  // --------------------------------------------------------

  // --------------------------------------------------------
  // Functions
  // --------------------------------------------------------

  const select = useCallback(
    (itemIndex: number) => {
      if (itemIndex < 0 || itemIndex >= filteredList.length) return;

      setSelected(itemIndex);

      var element = $(`#item${itemIndex}`);
      var list = $(".list");

      var elHeight = element.outerHeight() ?? 0;
      var scrollTop = list.scrollTop() ?? 0;
      var listHeight = list?.height() ?? 0;

      var viewport = scrollTop + listHeight;
      var elOffset = elHeight * itemIndex;

      if (elOffset < scrollTop) {
        list.scrollTop(elOffset);
      } else if (elOffset + elHeight > viewport) {
        list.scrollTop(scrollTop + elHeight);
      }
    },
    [setSelected, filteredList]
  );

  const handleListKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        select(selected - 1);
      } else if (event.key === "ArrowDown") {
        select(selected + 1);
      }
    },
    [select, selected]
  );

  const handleListClick = (itemId: number) => {
    select(itemId);
  };

  const filterList = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      setFilterText(value);
      setSelected(0);
    },
    [setFilterText, setSelected]
  );

  // --------------------------------------------------------
  // Effects
  // --------------------------------------------------------

  // Mounts and unmounts an event listener
  useEffect(() => {
    window.addEventListener(
      "keydown",
      function (e) {
        if (
          ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) >
          -1
        ) {
          e.preventDefault();
        }
      },
      false
    );

    document.addEventListener("keydown", handleListKeyDown);

    return () => {
      document.removeEventListener("keydown", handleListKeyDown);
    };
  }, [handleListKeyDown]);

  // Scroll list to top at the start of page life cycle
  useEffect(() => {
    $(".list").scrollTop(0);
  }, []);

  return (
    <div className="item-list-container">
      <input type="text" value={filterText} onChange={filterList}></input>

      <ul id="list" className="list test">
        {filteredList !== null &&
        filteredList !== undefined &&
        filteredList.length > 0 ? (
          <div>
            {filteredList.map((item) => (
              <ListItem
                item={item}
                itemIndex={filteredList.indexOf(item)}
                clickEvent={() => handleListClick(filteredList.indexOf(item))}
                key={item.itemid}
                currentItem={selected}
                deleteItemHandler={deleteItemHandler}
                shouldDelete={shouldDelete}
              ></ListItem>
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </ul>
    </div>
  );
}
