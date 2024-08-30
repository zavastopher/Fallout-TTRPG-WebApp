import $ from "jquery";
import { useCallback, useEffect, useState } from "react";

import ListItem from "./listItem";

function List({
  items,
  setItems,
  selected,
  setSelected,
  deleteItem,
  shouldDelete,
}) {
  const [filteredList, setFilteredList] = useState(null);
  const [filterText, setFilterText] = useState("");

  const select = useCallback(
    (itemIndex) => {
      if (itemIndex < 0 || itemIndex >= items.length) return;

      setSelected(itemIndex);

      var element = $(`#item${itemIndex}`);
      var list = $(".list");

      var elHeight = element.outerHeight();
      var scrollTop = list.scrollTop();
      var viewport = scrollTop + list.height();
      var elOffset = elHeight * itemIndex;

      if (elOffset < scrollTop) {
        list.scrollTop(elOffset);
      } else if (elOffset + elHeight > viewport) {
        list.scrollTop(scrollTop + elHeight);
      }
    },
    [items, setSelected]
  );

  const handleListKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowUp") {
        select(selected - 1);
      } else if (event.key === "ArrowDown") {
        select(selected + 1);
      }
    },
    [select, selected]
  );

  const handleListClick = (itemId, item) => {
    select(itemId);
  };

  const filterList = (event) => {
    const value = event.target.value;
    setFilterText(value);

    if (value.length === 0) {
      setFilteredList(items);
    } else {
      const newList = items.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredList(newList);
    }
  };

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

  useEffect(() => {
    if (items) {
      setFilteredList([...items]);
    }
  }, [items]);

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
                itemIndex={items.indexOf(item)}
                clickEvent={() => handleListClick(items.indexOf(item))}
                key={item.itemid}
                currentItem={selected}
                deleteItem={deleteItem}
                shouldDelete={shouldDelete}
              >
                {" "}
              </ListItem>
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </ul>
    </div>
  );
}

export default List;
