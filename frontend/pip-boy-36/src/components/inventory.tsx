// Libraries
import { useEffect, useState } from "react";
import axios from "axios";

// Components
import { Title } from "./title";
import { ContextMenu } from "./contextMenu";
import Select, { MultiValue } from "react-select";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// Import Stylesheets
import "react-tabs/style/react-tabs.css";
import { ListWithDescription } from "./ListWithDescription";
import { InventoryInputs, Item, ItemOption, User, UserOption } from "./types";
import React from "react";
import { ddStyles, ddTheme, ddUserStyles } from "./styles";

type InventoryProps = {
  self: User | null;
  currentUser: User | null;
  playerOptions: UserOption[];
};

export function Inventory({
  self,
  currentUser,
  playerOptions,
}: InventoryProps) {
  // --------------------------------------------------------
  // Members
  // --------------------------------------------------------
  const [selected, setSelected] = useState<number>(0);
  const [inventory, setInventory] = useState<Array<Item>>([]);
  const [filterText, setFilterText] = useState<string>("");

  const filteredList =
    filterText.length === 0
      ? inventory
      : inventory?.filter((item: Item) =>
          item.name.toLowerCase().includes(filterText.toLowerCase())
        );

  filteredList.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const [inputs, setInputs] = useState<InventoryInputs>({
    name: null,
    item: undefined,
    players: [],
    quantity: null,
    description: null,
  });

  const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);
  const [tabAdminDatabaseIdx, setTabAdminDatabaseIdx] = useState<number>(0);
  const [tabAdminPlayerIdx, setTabAdminPlayerIdx] = useState<number>(0);
  const [tabPlayerIdx, setTabPlayerIdx] = useState<number>(0);

  const unaddedItemOptions = itemOptions.filter((itemOption) => {
    if (inventory.find((el) => el.name === itemOption.value.name)) {
      return false;
    } else {
      return true;
    }
  });

  // --------------------------------------------------------
  // Functions
  // --------------------------------------------------------

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (currentUser || !self?.isadmin) {
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
        if (inputs?.quantity && inputs.item) {
          // Add item to player
          console.log("add!");

          axios
            .post(
              `${process.env.REACT_APP_BASEURL}/players/item/${currentUser.id}`,
              {
                itemid: inputs.item.itemid,
                quantity: inputs.quantity,
              }
            )
            .then((response) => {
              setInventory((val) => {
                return [...val, response.data[0]];
              });
            });
        }
      } else {
        if (inputs?.quantity) {
          // Update qty of item for player
          console.log("update qty!");
          var item = filteredList[selected];

          axios
            .put(
              `${process.env.REACT_APP_BASEURL}/players/item/${currentUser.id}`,
              {
                itemid: item.itemid,
                quantity: inputs.quantity,
              }
            )
            .then((response) => {
              var itemIdx: number = inventory.indexOf(item);
              var invCopy = [...inventory];

              console.log(response.data);

              invCopy[itemIdx] = response.data;

              setInventory(invCopy);
            });
        }
      }
    } else {
      // Player updating self, use player tabs
      if (tabPlayerIdx === 0) {
        if (inputs?.quantity && inputs.item) {
          // Add item to player
          console.log("add!");

          axios
            .post(`${process.env.REACT_APP_BASEURL}/players/item/${self?.id}`, {
              itemid: inputs.item.itemid,
              quantity: inputs.quantity,
            })
            .then((response) => {
              setInventory((val) => {
                return [...val, response.data[0]];
              });
            });
        }
      } else {
        if (inputs?.quantity) {
          // Update qty of item for player
          console.log("update qty!");
          var item = filteredList[selected];

          axios
            .put(`${process.env.REACT_APP_BASEURL}/players/item/${self?.id}`, {
              itemid: item.itemid,
              quantity: inputs.quantity,
            })
            .then((response) => {
              var itemIdx: number = inventory.indexOf(item);
              var invCopy = [...inventory];

              console.log(response.data);

              invCopy[itemIdx] = response.data;

              setInventory(invCopy);
            });
        }
      }
    }
  }

  function UpdateDatabase() {
    if (tabAdminDatabaseIdx === 0) {
      // Add Item
      if (inputs?.name && inputs.description) {
        console.log("add to database!");

        let qty = inputs.quantity ?? 1;
        let playerids: number[] = [];

        if (inputs?.players) {
          console.log(inputs.players);

          inputs.players.forEach((player: UserOption) => {
            if (player.value) {
              playerids.push(player.value?.id);
            }
          });
        }

        console.log(playerids);

        axios
          .post(`${process.env.REACT_APP_BASEURL}/items`, {
            name: inputs.name,
            description: inputs.description,
            quantity: qty,
            players: playerids,
          })
          .then((response) => {
            let item: Item = response.data;

            setInventory((val) => {
              return [...val, item];
            });
          });
      }
    } else {
      // Update Item
      if (inputs?.name || inputs?.description) {
        var currentItem = filteredList[selected];

        if (!inputs.name) {
          inputs.name = currentItem.name;
        }

        if (!inputs.description) {
          inputs.description = currentItem.description;
        }

        axios
          .put(`${process.env.REACT_APP_BASEURL}/items/${currentItem.itemid}`, {
            name: inputs.name,
            description: inputs.description,
          })
          .then((response) => {
            console.log(response.data);

            var filteredItems = inventory.filter(
              (item) => item.itemid === response.data.itemid
            );
            var item = filteredItems[0];
            var itemIdx = inventory.indexOf(item);

            var invCopy = [...inventory];
            var itemCopy = { ...filteredItems[0] };

            itemCopy.name = response.data.name;
            itemCopy.description = response.data.description;

            invCopy[itemIdx] = itemCopy;

            setInventory(invCopy);
          });
      }
    }
  }

  function removeDeletedItem(item: Item) {
    var invDeleteItem = inventory.filter(
      (invItem) => invItem.itemid !== item.itemid
    );

    setInventory(invDeleteItem);
  }

  const deleteItem = (item: Item) => {
    // Delete with axios,

    if (currentUser) {
      // Delete from Player by Admin
      axios
        .patch(
          `${process.env.REACT_APP_BASEURL}/players/item/${currentUser.id}`,
          { itemid: item.itemid }
        )
        .then((response) => {
          removeDeletedItem(response.data.deleted);
        });
    } else if (!self?.isadmin) {
      // Delete from Player by Player
      axios
        .patch(`${process.env.REACT_APP_BASEURL}/players/item/${self?.id}`, {
          itemid: item.itemid,
        })
        .then((response) => {
          removeDeletedItem(response.data.deleted);
        });
    } else {
      // Delete from Database
      axios
        .delete(`${process.env.REACT_APP_BASEURL}/items/${item.itemid}`)
        .then((response) => {
          removeDeletedItem(response.data.deleted);
        });
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setInputs: React.Dispatch<React.SetStateAction<InventoryInputs>>
  ) => {
    const name = event.currentTarget.name;
    const value = event.currentTarget.value;
    setInputs((values) => {
      return { ...values, [name]: value };
    });
  };

  // --------------------------------------------------------
  // Effects
  // --------------------------------------------------------

  /**
   * Effect for fetching inventory data from server
   */
  useEffect(() => {
    var itemOptions: Array<ItemOption>;

    if (self) {
      axios
        .get(`${process.env.REACT_APP_BASEURL}/items`, {})
        .then((response) => {
          itemOptions = response.data.map((item: Item) => ({
            value: item,
            label: item.name,
          }));

          if (currentUser && currentUser !== undefined) {
            // If a player is selected in the dropdown
            axios
              .get(
                `${process.env.REACT_APP_BASEURL}/players/item/${currentUser.id}`,
                {}
              )
              .then((response) => {
                setInventory(response.data);
                setItemOptions(itemOptions);
              });
          } else if (self?.isadmin) {
            // If no player is selected and the logged in user is the admin
            setInventory(response.data);
          } else {
            // Regular player
            axios
              .get(
                `${process.env.REACT_APP_BASEURL}/players/item/${self?.id}`,
                {}
              )
              .then((response) => {
                setInventory(response.data);
                setItemOptions(itemOptions);
              });
          }
        });
    }
  }, [currentUser, self]);

  return (
    <div>
      <Title title={"INVENTORY"}></Title>
      <ListWithDescription
        selected={selected}
        setSelected={setSelected}
        deleteItemHandler={deleteItem}
        shouldDelete={true}
        currentList="Inventory"
        filteredList={filteredList}
        filterText={filterText}
        setFilterText={setFilterText}
      />
      <div className="under-description inventory-quantity">
        <p>
          {filteredList &&
          filteredList[selected] &&
          filteredList[selected].quantity != null
            ? `Quantity: ${filteredList[selected].quantity}`
            : ""}
        </p>
      </div>
      <ContextMenu submitFunction={handleSubmit}>
        <div className="context-form">
          {self?.isadmin ? (
            <div>
              {currentUser ? (
                <div>
                  <Tabs
                    onSelect={(index) => {
                      setTabAdminPlayerIdx(index);
                      setInputs((val) => {
                        return {
                          name: null,
                          item: undefined,
                          players: null,
                          quantity: null,
                          description: null,
                        };
                      });
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
                          options={unaddedItemOptions}
                          styles={ddStyles}
                          theme={ddTheme}
                          isMulti={false}
                          onChange={(choice: ItemOption | null) => {
                            setInputs((val) => {
                              return {
                                ...val,
                                item: choice?.value,
                              };
                            });
                          }}
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
                      setInputs((val) => {
                        return {
                          name: null,
                          item: undefined,
                          players: null,
                          quantity: null,
                          description: null,
                        };
                      });
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
                          cols={22}
                          rows={5}
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
                            styles={ddUserStyles}
                            theme={ddTheme}
                            defaultValue={null}
                            isMulti={true}
                            onChange={(
                              choice: MultiValue<UserOption | UserOption[]>
                            ) => {
                              choice.forEach((value) => {
                                if (Array.isArray(value)) {
                                  setInputs((val) => ({
                                    ...val,
                                    players: value,
                                  }));
                                } else {
                                  setInputs((val) => {
                                    let players = val.players;

                                    if (!players) return { ...val };

                                    let alreadyInList = players.includes(value);

                                    if (alreadyInList) return { ...val };

                                    return {
                                      ...val,
                                      players: [...players, value],
                                    };
                                  });
                                }
                              });
                            }}
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
                          cols={22}
                          rows={5}
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
                setInputs((val) => {
                  return {
                    name: null,
                    item: undefined,
                    players: null,
                    quantity: null,
                    description: null,
                  };
                });
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
                      options={unaddedItemOptions}
                      styles={ddStyles}
                      theme={ddTheme}
                      isMulti={false}
                      onChange={(choice: ItemOption | null) =>
                        setInputs((values) => {
                          return { ...values, item: choice?.value };
                        })
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
