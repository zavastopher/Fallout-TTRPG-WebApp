import { useEffect, useState } from "react";

import Title from "./title";
import Description from "./description";
import List from "./list";

import axios from "axios";

function Quests() {
  const [selected, setSelected] = useState(0);
  const [quests, setQuests] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASEURL}/players/quests`, {})
      .then((response) => {
        setQuests(response.data);
      });
  }, []);

  //const questItems = [
  //  {
  //    id: 1,
  //    name: "Quest 1",
  //    description: "this is a thing",
  //  },
  //  {
  //    id: 2,
  //    name: "Quest 2",
  //    description: "this is a second thing",
  //  },
  //  {
  //    id: 3,
  //    name: "Quest 3",
  //    description: "this is a third thing",
  //  },
  //  {
  //    id: 4,
  //    name: "Quest 4",
  //    description: "this is a fourth thing",
  //  },
  //  {
  //    id: 5,
  //    name: "Quest 5",
  //    description: "this is a fifth thing",
  //  },
  //  {
  //    id: 6,
  //    name: "Quest 6",
  //    description: "this is a sixth thing",
  //  },
  //  {
  //    id: 7,
  //    name: "Quest 7",
  //    description: "this is a seventh thing",
  //  },
  //  {
  //    id: 8,
  //    name: "Quest 8",
  //    description: "this is a eighth thing",
  //  },
  //  {
  //    id: 9,
  //    name: "Quest 9",
  //    description: "this is a ninth thing",
  //  },
  //  {
  //    id: 10,
  //    name: "Quest 10",
  //    description: "this is a tenth thing",
  //  },
  //  {
  //    id: 11,
  //    name: "Quest 11",
  //    description: "this is a eleventh thing",
  //  },
  //];

  return (
    <div>
      <Title title={"QUESTS"}></Title>
      <div id="quests" className="list-container">
        <List
          items={quests}
          selected={selected}
          setSelected={setSelected}
        ></List>
        <div className="quest-description description">
          <Description
            items={quests}
            currentItem={selected}
            currentList="Quest"
          ></Description>
        </div>
      </div>
    </div>
  );
}

export default Quests;
