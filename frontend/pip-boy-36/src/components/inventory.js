import Title from "./title";
import Description from "./description";
import List from "./list";
import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import axios from "axios";

const baseURL = "http://localhost/api";

function Inventory() {
  const location = useLocation();
  const { self } = location.state;
  const [selected, setSelected] = useState(0);
  const [inventory, setInventory] = useState(null);

  useEffect(() => {
    console.log(location.state);
    if (self) {
      axios.get(`${baseURL}/players/item/${self.id}`, {}).then((response) => {
        setInventory(response.data);
      });
    }
  }, [self]);

  const inventoryItems = [
    {
      id: 1,
      name: "item 1",
      description: "this is a thing",
      quantity: 1,
    },
    {
      id: 2,
      name: "item 2",
      description: "this is a second thing",
      quantity: 2,
    },
    {
      id: 3,
      name: "item 3",
      description: "this is a third thing",
      quantity: 3,
    },
    {
      id: 4,
      name: "item 4",
      description: "this is a fourth thing",
      quantity: 4,
    },
    {
      id: 5,
      name: "item 5",
      description: "this is a fifth thing",
      quantity: 5,
    },
    {
      id: 6,
      name: "item 6",
      description: "this is a sixth thing",
      selected: false,
      quantity: 6,
    },
    {
      id: 7,
      name: "item 7",
      description: "this is a seventh thing",
      quantity: 7,
    },
    {
      id: 8,
      name: "item 8",
      description: "this is a eighth thing",
      quantity: 8,
    },
    {
      id: 9,
      name: "item 9",
      description: "this is a ninth thing",
      quantity: 9,
    },
    {
      id: 10,
      name: "item 10",
      description: "this is a tenth thing",
      quantity: 10,
    },
    {
      id: 11,
      name: "item 11",
      description: "this is a eleventh thing",
      quantity: 11,
    },
  ];

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
    </div>
  );
}

export default Inventory;
