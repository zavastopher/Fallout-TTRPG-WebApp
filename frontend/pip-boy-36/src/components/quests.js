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

export function Quests({
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
  const [quests, setQuests] = useState(null);
  const [filterText, setFilterText] = useState("");

  const filteredList =
    filterText.length === 0
      ? quests
      : quests.filter((item) =>
          item.name.toLowerCase().includes(filterText.toLowerCase())
        );
  const [inputs, setInputs] = useState({});

  const [questOptions, setQuestOptions] = useState([]);
  const [tabIdx, setTabIdx] = useState(0);

  // --------------------------------------------------------
  // Functions
  // --------------------------------------------------------

  const handleSubmit = (event) => {
    event.preventDefault();

    if (currentUser || !self.isadmin) {
      assignToPlayer();
    } else {
      UpdateDatabase();
    }
  };

  function assignToPlayer() {
    if (inputs.quest) {
      console.log("add!");
    }
  }

  function UpdateDatabase() {
    if (tabIdx === 0) {
      // Add quest
      if (inputs.name && inputs.description) {
        console.log("add to database!");

        if (inputs.players) {
          inputs.players.forEach((player) => {
            console.log(`Add to ${player.label} at ${player.value}`);
            //var playerid = player.value;
          });
        }
      }
    } else {
      // Update quest
      if (inputs.name || inputs.description || inputs.status) {
        console.log("update!");
        console.log(inputs);
      }
    }
  }

  function deleteQuest(item) {
    // Delete with axios
    // Deleting quest only posible for admin

    if (currentUser) {
      console.log(`delete quest: ${item.name} from player ${currentUser.id}`);
    } else if (self.isadmin) {
      // Delete quest from database
      console.log(`delete quest: ${item.name} from database`);
    }
  }

  // --------------------------------------------------------
  // Effects
  // --------------------------------------------------------
  /**
   * Effect for fetching quest data from server
   */
  useEffect(() => {
    if (self.isadmin) {
      axios
        .get(`${process.env.REACT_APP_BASEURL}/quests`, {})
        .then((response) => {
          setQuestOptions(
            response.data.map((quest) => ({
              value: quest,
              label: quest.name,
            }))
          );

          if (currentUser && currentUser !== undefined) {
            // If a player is selected in the dropdown
            axios
              .get(
                `${process.env.REACT_APP_BASEURL}/players/quests/${currentUser.id}`,
                {}
              )
              .then((response) => {
                setQuests(response.data);
              });
          } else if (self.isadmin) {
            // If no player is selected and the logged in user is the admin
            setQuests(response.data);
          }
        });
    } else {
      axios
        .get(`${process.env.REACT_APP_BASEURL}/players/quests`, {})
        .then((response) => {
          setQuests(response.data);
        });
    }
  }, [currentUser, self]);

  return (
    <div>
      <Title title={"QUESTS"}></Title>
      <ListWithDescription
        selected={selected}
        setSelected={setSelected}
        items={quests}
        deleteItemHandler={deleteQuest}
        shouldDelete={self.isadmin}
        currentList="Quests"
        filteredList={filteredList}
        filterText={filterText}
        setFilterText={setFilterText}
      />
      <div className="quest-status">
        Status:{" "}
        {filteredList && filteredList[selected]
          ? filteredList[selected].status
          : ""}
      </div>
      {self.isadmin ? (
        <ContextMenu submitFunction={handleSubmit}>
          <div className="context-form">
            {currentUser ? (
              <div>
                <span>Assign Quest to {currentUser.name}</span>

                <div className="fields">
                  <label htmlFor="quest">Quest</label>
                  <Select
                    id="quest"
                    options={questOptions}
                    styles={colorStyles}
                    theme={customTheme}
                    onChange={(choice) =>
                      setInputs((values) => ({ ...values, quest: choice }))
                    }
                  />
                </div>
              </div>
            ) : (
              <div>
                <Tabs
                  onSelect={(index) => {
                    setTabIdx(index);
                    setInputs({});
                  }}
                  disableUpDownKeys={true}
                >
                  <TabList>
                    <Tab>Add Quest</Tab>
                    <Tab>Update Selected Quest</Tab>
                  </TabList>

                  <TabPanel>
                    <span>Add Quest to Database</span>

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
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <span>Update Quest in Database</span>

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

                    <div className="fields">
                      <label htmlFor="status">Status</label>
                      <Select
                        options={[
                          { value: "incomplete", label: "Incomplete" },
                          { value: "success", label: "Success" },
                          { value: "failure", label: "Failure" },
                        ]}
                        styles={colorStyles}
                        theme={customTheme}
                        onChange={(choice) =>
                          setInputs((values) => ({
                            ...values,
                            status: choice,
                          }))
                        }
                      />
                    </div>
                  </TabPanel>
                </Tabs>
              </div>
            )}
          </div>
        </ContextMenu>
      ) : (
        <div />
      )}
    </div>
  );
}
