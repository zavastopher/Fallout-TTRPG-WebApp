import Title from "./title";
import Description from "./description";
import List from "./list";
import { useEffect, useState } from "react";

import axios from "axios";
import ContextMenu from "./contextMenu";
import Select from "react-select";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

function Quests({
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
  const [selected, setSelected] = useState(0);
  const [quests, setQuests] = useState(null);

  const [questOptions, setQuestOptions] = useState([]);
  const [tabIdx, setTabIdx] = useState(0);

  // Dropdown styles
  const blackTransColor = "rgba(0, 0, 0, .75)";
  const greenTransColor = "rgba(0, 128, 0, .75)";
  const dropdownFontSize = "16px";

  useEffect(() => {
    resetInputs();
  }, []);

  useEffect(() => {
    if(self.isadmin){
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
              `${process.env.REACT_APP_BASEURL}/players/quests/${currentUser.personid}`,
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
    } else  {
      axios
        .get(
          `${process.env.REACT_APP_BASEURL}/players/quests`,{}
        )
        .then((response) => {
          setQuests(response.data);
        });
    }
    
  }, [currentUser]);

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
    if (tabIdx == 0) {
      // Add quest
      if (inputs.name && inputs.description) {
        console.log("add to database!");

        if (inputs.players) {
          inputs.players.forEach((player) => {
            console.log(`Add to ${player.label} at ${player.value}`);
            var playerid = player.value;
          });
        }
      }
    } else {
      // Update quest
      if (inputs.name || inputs.description) {
        console.log("update!");
      }
    }
  }

  function deleteQuest() {
    // Delete with axios,
    console.log("delete quest");
  }

  return (
    <div>
      <Title title={"QUESTS"}></Title>
      <div id="quests" className="list-container">
        <List
          items={quests}
          selected={selected}
          setSelected={setSelected}
          deleteItem={deleteQuest}
        ></List>
        <div className="quest-description description">
          <Description
            items={quests}
            currentItem={selected}
            currentList="Quest"
          ></Description>
        </div>
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
                      setInputs((values) => ({ ...values, ["quest"]: choice }))
                    }
                  />
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
                            : quests && quests[selected]
                            ? quests[selected].name
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
                            : quests && quests[selected]
                            ? quests[selected].description
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
        </ContextMenu>
      ) : (
        <div />
      )}
    </div>
  );
}

export default Quests;
