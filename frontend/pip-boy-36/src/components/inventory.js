import Title from "./title";
import Description from "./description";
import List from "./list";
import { useEffect, useState } from "react";

import axios from "axios";
import ContextMenu from "./contextMenu";
import Select from "react-select";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

function Inventory({
  self,
  currentUser,
  playerOptions,
  inputs,
  setInputs,
  resetInputs,
  customTheme,
  colorStyles,
  handleInputChange,
}) {
  // const location = useLocation();
  const [selected, setSelected] = useState(0);
  const [inventory, setInventory] = useState(null);

  const [itemOptions, setItemOptions] = useState([]);
  const [tabIdx, setTabIdx] = useState(0);

  useEffect(() => {
    resetInputs();
  }, []);

  useEffect(() => {
    //var inventory;

    axios.get(`${process.env.REACT_APP_BASEURL}/items`, {}).then((response) => {
      console.log(response.data);
      setItemOptions(
        response.data.map((item) => ({
          value: item,
          label: item.name,
        }))
      );

      if (currentUser && currentUser !== undefined) {
        // If a player is selected in the dropdown
        axios
          .get(
            `${process.env.REACT_APP_BASEURL}/players/item/${currentUser.personid}`,
            {}
          )
          .then((response) => {
            setInventory(response.data);
          });
      } else if (self.isadmin) {
        // If no player is selected and the logged in user is the admin
        setInventory(response.data);
      } else {
        // Regular player
        axios
          .get(`${process.env.REACT_APP_BASEURL}/players/item/${self.id}`, {})
          .then((response) => {
            setInventory(response.data);
          });
      }
    });
  }, [currentUser, self]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (currentUser || !self.isadmin) {
      addToPlayer();
    } else {
      UpdateDatabase();
    }
  };

  function addToPlayer() {
    if (inputs.item && inputs.quantity) {
      console.log("add!");
    }
  }

  function UpdateDatabase() {
    if (tabIdx == 0) {
      // Add Item
      if (inputs.name && inputs.description && inputs.quantity) {
        console.log("add to database!");

        if (inputs.players) {
          inputs.players.forEach((player) => {
            console.log(`Add to ${player.label} at ${player.value}`);
            var playerid = player.value;
          });
        }
      }
    } else {
      // Update Item
      if (inputs.name || inputs.description) {
        console.log("update!");
      }
    }
  }

  function deleteItem() {
    // Delete with axios,
    console.log("delete item");
  }

  return (
    <div>
      <Title title={"INVENTORY"}></Title>
      <div id="inventory" className="list-container">
        <List
          items={inventory}
          selected={selected}
          setSelected={setSelected}
          deleteItem={deleteItem}
        ></List>
        <div className="inventory-description description">
          <Description
            items={inventory}
            currentItem={selected}
            currentList="Inventory"
          ></Description>
        </div>
      </div>
      <ContextMenu submitFunction={handleSubmit}>
        <div className="context-form">
          {self.isadmin ? (
            <div>
              {currentUser ? (
                <div>
                  <span>Add Item to {currentUser.name}</span>

                  <div className="fields">
                    <label htmlFor="item">Item</label>
                    <Select
                      id="item"
                      options={itemOptions}
                      styles={colorStyles}
                      theme={customTheme}
                      onChange={(choice) =>
                        setInputs((values) => ({ ...values, ["item"]: choice }))
                      }
                    />
                  </div>
                  <div className="fields">
                    <label htmlFor="quantity">Qty</label>
                    <input
                      name="quantity"
                      id="quantity"
                      type="text"
                      value={inputs.quantity || ""}
                      onChange={handleInputChange}
                    ></input>
                  </div>
                </div>
              ) : (
                <div>
                  <Tabs
                    onSelect={(index) => {
                      setTabIdx(index);
                      resetInputs();
                    }}
                  >
                    <TabList>
                      <Tab>Add Item</Tab>
                      <Tab>Update Selected Item</Tab>
                    </TabList>

                    <TabPanel>
                      <span>Add Item to Database</span>

                      <div className="fields">
                        <label htmlFor="name">Name</label>
                        <input
                          name="name"
                          id="name"
                          type="text"
                          value={inputs.name || ""}
                          onChange={handleInputChange}
                        ></input>
                      </div>

                      <div className="fields">
                        <label htmlFor="description">Description</label>
                        <textarea
                          name="description"
                          id="description"
                          cols="22"
                          rows="5"
                          value={inputs.description || ""}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <div className="player-dropdown">
                        <div className="fields field-column">
                          <label>Players</label>
                          <Select
                            options={playerOptions}
                            styles={colorStyles}
                            theme={customTheme}
                            defaultValue={null}
                            isMulti
                            onChange={(choice) =>
                              setInputs((values) => ({
                                ...values,
                                ["players"]: choice,
                              }))
                            }
                          ></Select>
                        </div>
                        <div className="fields field-column">
                          <label htmlFor="quantity">Qty</label>
                          <input
                            name="quantity"
                            id="quantity"
                            type="text"
                            value={inputs.quantity || ""}
                            onChange={handleInputChange}
                          ></input>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <span>Update Item in Database</span>

                      <div className="fields">
                        <label htmlFor="name">Name</label>
                        <input
                          name="name"
                          id="name"
                          type="text"
                          value={
                            inputs.name
                              ? inputs.name
                              : inventory && inventory[selected]
                              ? inventory[selected].name
                              : ""
                          }
                          onChange={handleInputChange}
                        ></input>
                      </div>

                      <div className="fields">
                        <label htmlFor="description">Description</label>
                        <textarea
                          name="description"
                          id="description"
                          cols="22"
                          rows="5"
                          value={
                            inputs.description
                              ? inputs.description
                              : inventory && inventory[selected]
                              ? inventory[selected].description
                              : ""
                          }
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </TabPanel>
                  </Tabs>
                </div>
              )}
            </div>
          ) : (
            <div>
              <span>Add Item to My Inventory</span>
              <div className="fields">
                <label htmlFor="item">Item</label>
                <Select
                  id="item"
                  options={itemOptions}
                  styles={colorStyles}
                  theme={customTheme}
                  onChange={(choice) =>
                    setInputs((values) => ({ ...values, ["item"]: choice }))
                  }
                />
              </div>

              <div className="fields field-column">
                <label htmlFor="quantity">Qty</label>
                <input
                  name="quantity"
                  id="quantity"
                  type="text"
                  value={inputs.quantity || ""}
                  onChange={handleInputChange}
                ></input>
              </div>
            </div>
          )}
        </div>
      </ContextMenu>
    </div>
  );
}

export default Inventory;
