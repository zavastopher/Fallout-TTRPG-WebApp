import $ from "jquery";
import { useCallback, useEffect } from "react";

import ListItem from "./listItem";

function List({ items, selected, setSelected, deleteItem }) {
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

  const handleListClick = (itemId) => {
    select(itemId);
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
    $(".list").scrollTop(0);
  }, []);

  return (
    <ul id="list" className="list test">
      {items !== null && items !== undefined && items.length > 0 ? (
        items.map((item) => (
          <ListItem
            item={item}
            itemIndex={items.indexOf(item)}
            clickEvent={() => handleListClick(items.indexOf(item))}
            key={item.id}
            currentItem={selected}
            deleteItem={deleteItem}
          >
            {" "}
          </ListItem>
        ))
      ) : (
        <div></div>
      )}
    </ul>
  );
}

export default List;
