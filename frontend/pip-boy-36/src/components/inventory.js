// Libraries
import { useEffect, useState } from "react";
import axios from "axios";

// Components
import { Title } from "./title";
import { ContextMenu } from "./contextMenu";
import Select from "react-select";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// Import Stylesheets
import "react-tabs/style/react-tabs.css";
import { ListWithDescription } from "./ListWithDescription";

export function Inventory({
  self,
  currentUser,
  playerOptions,
  customTheme,
  colorStyles,
  handleInputChange,
}) {
  // --------------------------------------------------------
  // Members
  // --------------------------------------------------------
  const [selected, setSelected] = useState(0);
  const [inventory, setInventory] = useState(null);
  const [filterText, setFilterText] = useState("");

  const filteredList =
    filterText.length === 0
      ? inventory
      : inventory.filter((item) =>
          item.name.toLowerCase().includes(filterText.toLowerCase())
        );

  const [inputs, setInputs] = useState({});

  const [itemOptions, setItemOptions] = useState([]);
  const [tabAdminDatabaseIdx, setTabAdminDatabaseIdx] = useState(0);
  const [tabAdminPlayerIdx, setTabAdminPlayerIdx] = useState(0);
  const [tabPlayerIdx, setTabPlayerIdx] = useState(0);

  // --------------------------------------------------------
  // Functions
  // --------------------------------------------------------

  const handleSubmit = (event) => {
    event.preventDefault();

    if (currentUser || !self.isadmin) {
      UpdatePlayer();
    } else {
      UpdateDatabase();
    }
  };

  // Add Item to Player or change quantity
  function UpdatePlayer() {
    if (currentUser) {
      // Admin Updating player, use admin player tabs
      if (tabAdminPlayerIdx === 0) {
        if (inputs.quantity && inputs.item) {
          // Add item to player
          console.log("add!");
        }
      } else {
        if (inputs.quantity) {
          // Update qty of item for player
          console.log("update qty!");
        }
      }
    } else {
      // Player updating self, use player tabs
      if (tabPlayerIdx === 0) {
        if (inputs.quantity && inputs.item) {
          // Add item to player
          console.log("add!");
        }
      } else {
        if (inputs.quantity) {
          // Update qty of item for player
          console.log("update qty!");
        }
      }
    }
  }

  function UpdateDatabase() {
    if (tabAdminDatabaseIdx === 0) {
      // Add Item
      if (inputs.name && inputs.description && inputs.quantity) {
        console.log("add to database!");

        if (inputs.players) {
          inputs.players.forEach((player) => {
            console.log(`Add to ${player.label} at ${player.value}`);
            //var playerid = player.value;
          });
        }
      }
    } else {
      // Update Item
      if (inputs.name || inputs.description) {
        console.log(`update ${filteredList[selected].name} to ${inputs.name}!`);
      }
    }
  }

  const deleteItem = (item) => {
    // Delete with axios,

    if (currentUser) {
      // Delete from Player by Admin
      console.log(`delete ${item.name} from ${currentUser.name}!`);
    } else if (!self.isadmin) {
      // Delete from Player by Player
      console.log(`delete ${item.name} from ${self.name}!`);
    } else {
      // Delete from Database
      console.log(`delete ${item.name} from Database!`);
    }
  };

  // --------------------------------------------------------
  // Effects
  // --------------------------------------------------------

  /**
   * Effect for fetching inventory data from server
   */
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASEURL}/items`, {}).then((response) => {
      // console.log(response.data);
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
            `${process.env.REACT_APP_BASEURL}/players/item/${currentUser.id}`,
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

  return (
    <div>
      <Title title={"INVENTORY"}></Title>
      <ListWithDescription
        selected={selected}
        setSelected={setSelected}
        items={inventory}
        deleteItemHandler={deleteItem}
        shouldDelete={true}
        currentList="Inventory"
        filteredList={filteredList}
        filterText={filterText}
        setFilterText={setFilterText}
      />
      <ContextMenu submitFunction={handleSubmit}>
        <div className="context-form">
          {self.isadmin ? (
            <div>
              {currentUser ? (
                <div>
                  <Tabs
                    onSelect={(index) => {
                      setTabAdminPlayerIdx(index);
                      setInputs({});
                    }}
                    disableUpDownKeys={true}
                  >
                    <TabList>
                      <Tab>Add Item</Tab>
                      <Tab disabled={!(filteredList && filteredList[selected])}>
                        Update Selected Item
                      </Tab>
                    </TabList>
                    <TabPanel>
                      <span>Add Item to {currentUser.name}</span>

                      <div className="fields">
                        <label htmlFor="item">Item</label>
                        <Select
                          id="item"
                          options={itemOptions}
                          styles={colorStyles}
                          theme={customTheme}
                          onChange={(choice) =>
                            setInputs((values) => ({
                              ...values,
                              item: choice,
                            }))
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
                          onChange={(event) =>
                            handleInputChange(event, setInputs)
                          }
                        ></input>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <span>
                        Update{" "}
                        <span style={{ textTransform: "capitalize" }}>
                          {filteredList && filteredList[selected]
                            ? `"${filteredList[selected].name}"`
                            : "Item"}
                        </span>{" "}
                        Quantity
                      </span>

                      <div className="fields field-column">
                        <label htmlFor="quantity">Qty</label>
                        <input
                          name="quantity"
                          id="quantity"
                          type="text"
                          value={inputs.quantity || ""}
                          onChange={(event) =>
                            handleInputChange(event, setInputs)
                          }
                        ></input>
                      </div>
                    </TabPanel>
                  </Tabs>
                </div>
              ) : (
                <div>
                  <Tabs
                    onSelect={(index) => {
                      setTabAdminDatabaseIdx(index);
                      setInputs({});
                    }}
                    disableUpDownKeys={true}
                  >
                    <TabList>
                      <Tab>Add Item</Tab>
                      <Tab disabled={!(filteredList && filteredList[selected])}>
                        Update Selected Item
                      </Tab>
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
                          onChange={(event) =>
                            handleInputChange(event, setInputs)
                          }
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
                          onChange={(event) =>
                            handleInputChange(event, setInputs)
                          }
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
                                players: choice,
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
                            onChange={(event) =>
                              handleInputChange(event, setInputs)
                            }
                          ></input>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <span>
                        Update{" "}
                        <span style={{ textTransform: "capitalize" }}>
                          {filteredList && filteredList[selected]
                            ? `"${filteredList[selected].name}"`
                            : "Item"}
                        </span>{" "}
                        in Database
                      </span>

                      <div className="fields">
                        <label htmlFor="name">Name</label>
                        <input
                          name="name"
                          id="name"
                          type="text"
                          value={
                            inputs.name
                              ? inputs.name
                              : filteredList && filteredList[selected]
                              ? filteredList[selected].name
                              : ""
                          }
                          onChange={(event) =>
                            handleInputChange(event, setInputs)
                          }
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
                              : filteredList && filteredList[selected]
                              ? filteredList[selected].description
                              : ""
                          }
                          onChange={(event) =>
                            handleInputChange(event, setInputs)
                          }
                        ></textarea>
                      </div>
                    </TabPanel>
                  </Tabs>
                </div>
              )}
            </div>
          ) : (
            <Tabs
              onSelect={(index) => {
                setTabPlayerIdx(index);
                setInputs({});
              }}
              disableUpDownKeys={true}
            >
              <TabList>
                <Tab>Add Item</Tab>
                <Tab disabled={!(filteredList && filteredList[selected])}>
                  Update Selected Item
                </Tab>
              </TabList>

              <TabPanel>
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
                        setInputs((values) => ({ ...values, item: choice }))
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
                      onChange={(event) => handleInputChange(event, setInputs)}
                    ></input>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <span>
                  Update{" "}
                  <span style={{ textTransform: "capitalize" }}>
                    {filteredList && filteredList[selected]
                      ? `"${filteredList[selected].name}"`
                      : "Item"}
                  </span>{" "}
                  Quantity
                </span>

                <div className="fields field-column">
                  <label htmlFor="quantity">Qty</label>
                  <input
                    name="quantity"
                    id="quantity"
                    type="text"
                    value={inputs.quantity || ""}
                    onChange={(event) => handleInputChange(event, setInputs)}
                  ></input>
                </div>
              </TabPanel>
            </Tabs>
          )}
        </div>
      </ContextMenu>
    </div>
  );
}
