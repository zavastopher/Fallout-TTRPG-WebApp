import { Description } from "./description";
import { List } from "./list";

export function ListWithDescription({
  selected,
  setSelected,
  items,
  deleteItemHandler,
  shouldDelete,
  currentList,
  filteredList,
  filterText,
  setFilterText,
}) {
  // --------------------------------------------------------
  // Members
  // --------------------------------------------------------
  const currentItem = filteredList ? filteredList[selected] : null;

  return (
    <div id={currentList.toLowerCase()} className="list-container">
      <List
        items={items}
        selected={selected}
        setSelected={setSelected}
        deleteItemHandler={() => deleteItemHandler(currentItem)}
        shouldDelete={shouldDelete}
        // setCurrentItem={setCurrentItemIdx}
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
