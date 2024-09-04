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
import {
  ddQuestStatusStyles,
  ddQuestStyles,
  ddTheme,
  ddUserStyles,
} from "./styles";
import {
  User,
  UserOption,
  QuestInputs,
  Quest,
  QuestOption,
  QuestStatus,
  QuestStatusOption,
} from "./types";
import React from "react";

type QuestsProps = {
  self: User | null;
  currentUser: User | null;
  playerOptions: UserOption[];
};

export function Quests({ self, currentUser, playerOptions }: QuestsProps) {
  // --------------------------------------------------------
  // Members
  // --------------------------------------------------------
  const [selected, setSelected] = useState<number>(0);
  const [quests, setQuests] = useState<Array<Quest>>([]);
  const [filterText, setFilterText] = useState<string>("");

  const filteredList =
    filterText.length === 0
      ? quests
      : quests.filter((item: Quest) =>
          item.name.toLowerCase().includes(filterText.toLowerCase())
        );

  filteredList.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const [inputs, setInputs] = useState<QuestInputs>({
    name: null,
    quest: undefined,
    players: null,
    description: null,
    status: undefined,
  });

  const [questOptions, setQuestOptions] = useState<QuestOption[]>([]);
  const [tabIdx, setTabIdx] = useState<number>(0);

  // --------------------------------------------------------
  // Functions
  // --------------------------------------------------------

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (currentUser || !self?.isadmin) {
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

        let playerids: number[] = [];

        if (inputs.players) {
          inputs.players.forEach((player: UserOption) => {
            if (player.value) {
              playerids.push(player.value?.id);
            }
          });
        }

        console.log(playerids);

        axios
          .post(`${process.env.REACT_APP_BASEURL}/quests`, {
            name: inputs.name,
            description: inputs.description,
            players: playerids,
          })
          .then((response) => {
            let quest: Quest = response.data;

            setQuests((val) => {
              return [...val, quest];
            });
          });
      }
    } else {
      // Update quest
      if (inputs.name || inputs.description || inputs.status) {
        console.log("update!");
        var currentQuest: Quest = filteredList[selected];

        if (!inputs.name) {
          inputs.name = currentQuest.name;
        }

        if (!inputs.description) {
          inputs.description = currentQuest.description;
        }

        if (!inputs.status) {
          inputs.status = currentQuest.status;
        }

        axios
          .put(
            `${process.env.REACT_APP_BASEURL}/quests/${currentQuest.questid}`,
            {
              name: inputs.name,
              description: inputs.description,
              status: inputs.status,
            }
          )
          .then((response) => {
            var updatedQuest: Quest = response.data;

            var copyQuestList = quests.filter(
              (quest) => quest.questid != updatedQuest.questid
            );

            copyQuestList.push(updatedQuest);

            setQuests(copyQuestList);
          });
      }
    }
  }

  function deleteQuest(quest: Quest) {
    // Delete with axios
    // Deleting quest only posible for admin

    if (currentUser) {
      console.log(`delete quest: ${quest.name} from player ${currentUser.id}`);
    } else if (self?.isadmin) {
      // Delete quest from database
      console.log(`delete quest: ${quest.name} from database`);
    }
  }

  //const handleTextAreaInputChange = (
  //  event: React.ChangeEvent<HTMLTextAreaElement>,
  //  setInputs: React.Dispatch<React.SetStateAction<QuestInputs>>
  //) => {
  //  const name = event.currentTarget.name;
  //  const value = event.currentTarget.value;
  //  setInputs((values) => {
  //    return { ...values, [name]: value };
  //  });
  //};

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setInputs: React.Dispatch<React.SetStateAction<QuestInputs>>
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
   * Effect for fetching quest data from server
   */
  useEffect(() => {
    if (self?.isadmin) {
      axios
        .get(`${process.env.REACT_APP_BASEURL}/quests`, {})
        .then((response) => {
          setQuestOptions(
            response.data.map((quest: Quest) => ({
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
        deleteItemHandler={deleteQuest}
        shouldDelete={self?.isadmin ?? false}
        currentList="Quests"
        filteredList={filteredList}
        filterText={filterText}
        setFilterText={setFilterText}
      />
      <div className="under-description quest-status">
        Status:{" "}
        {filteredList && filteredList[selected]
          ? filteredList[selected].status
          : ""}
      </div>
      {self?.isadmin ? (
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
                    styles={ddQuestStyles}
                    theme={ddTheme}
                    isMulti={false}
                    onChange={(choice: QuestOption | null) =>
                      setInputs((val) => {
                        return { ...val, quest: choice?.value };
                      })
                    }
                  />
                </div>
              </div>
            ) : (
              <div>
                <Tabs
                  onSelect={(index) => {
                    setTabIdx(index);
                    setInputs({
                      name: null,
                      quest: undefined,
                      players: null,
                      description: null,
                      status: undefined,
                    });
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
                          isMulti
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

                                  if (!players)
                                    return { ...val, players: [value] };

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

                    <div className="fields">
                      <label htmlFor="status">Status</label>
                      <Select
                        options={QuestStatus}
                        styles={ddQuestStatusStyles}
                        theme={ddTheme}
                        isMulti={false}
                        onChange={(choice: QuestStatusOption | null) =>
                          setInputs((values) => {
                            return {
                              ...values,
                              status: choice?.value,
                            };
                          })
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
