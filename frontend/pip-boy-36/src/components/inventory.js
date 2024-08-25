import Title from "./title";
import Description from "./description";
import List from "./list";
import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import axios from "axios";
import ContextMenu from "./contextMenu";

function Inventory({ self, currentUser }) {
  const location = useLocation();
  const [selected, setSelected] = useState(0);
  const [inventory, setInventory] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser !== undefined) {
      // If a player is selected in the dropdown
      axios
        .get(
          `${process.env.REACT_APP_BASEURL}/players/item/${currentUser.id}`,
          {}
        )
        .then((response) => {
          setInventory(response.data);
        });
    } else if (self.isadmin) {
      // If no player is selected and the logged in user is the admin
      axios
        .get(`${process.env.REACT_APP_BASEURL}/items`, {})
        .then((response) => {
          setInventory(response.data);
        });
    } else {
      // Regular player
      axios
        .get(`${process.env.REACT_APP_BASEURL}/players/item/${self.id}`, {})
        .then((response) => {
          setInventory(response.data);
        });
    }
  }, [currentUser, self]);

  //const inventoryItems = [
  //  {
  //    id: 1,
  //    name: "item 1",
  //    description: "this is a thing",
  //    quantity: 1,
  //  },
  //  {
  //    id: 2,
  //    name: "item 2",
  //    description: "this is a second thing",
  //    quantity: 2,
  //  },
  //  {
  //    id: 3,
  //    name: "item 3",
  //    description: "this is a third thing",
  //    quantity: 3,
  //  },
  //  {
  //    id: 4,
  //    name: "item 4",
  //    description: "this is a fourth thing",
  //    quantity: 4,
  //  },
  //  {
  //    id: 5,
  //    name: "item 5",
  //    description: "this is a fifth thing",
  //    quantity: 5,
  //  },
  //  {
  //    id: 6,
  //    name: "item 6",
  //    description: "this is a sixth thing",
  //    selected: false,
  //    quantity: 6,
  //  },
  //  {
  //    id: 7,
  //    name: "item 7",
  //    description: "this is a seventh thing",
  //    quantity: 7,
  //  },
  //  {
  //    id: 8,
  //    name: "item 8",
  //    description: "this is a eighth thing",
  //    quantity: 8,
  //  },
  //  {
  //    id: 9,
  //    name: "item 9",
  //    description: "this is a ninth thing",
  //    quantity: 9,
  //  },
  //  {
  //    id: 10,
  //    name: "item 10",
  //    description: "this is a tenth thing",
  //    quantity: 10,
  //  },
  //  {
  //    id: 11,
  //    name: "item 11",
  //    description: "this is a eleventh thing",
  //    quantity: 11,
  //  },
  //];

  return (
    <div>
      <Title title={"INVENTORY"}></Title>
      <div id="inventory" className="list-container">
        <List
          items={inventory}
          selected={selected}
          setSelected={setSelected}
        ></List>
        <div className="inventory-description description">
          <Description
            items={inventory}
            currentItem={selected}
            currentList="Inventory"
          ></Description>
        </div>
      </div>
      <ContextMenu>
        <div className="context-form">
          <span>Add Item to Database</span>
          <div className="fields">
            <label>
              Name
              <input name="itemname" id="itemname" type="text"></input>
            </label>
          </div>

          <div className="fields">
            <label>
              Description
              <textarea
                name="itemdescription"
                id="itemdescription"
                cols="22"
                rows="5"
              ></textarea>
            </label>
          </div>
        </div>
      </ContextMenu>
    </div>
  );
}

export default Inventory;
