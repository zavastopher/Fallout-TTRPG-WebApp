import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Limb from "./limb";
import Title from "./title";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faPencil } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function Stats({ hp, limbsHurt }) {
  const Face = "./pipboy/fullFace.png";
  const [editHP, setEditHP] = useState(true);
  const [newHP, setNewHP] = useState(null);

  function onChangeHP(event) {
    const name = event.target.name;
    const value = event.target.value;
    //if(value === null || value)
    console.log(value);
    setNewHP(value);
  }

  function onSubmitHP(event) {
    // Validate HP (Check if it is different or allowed)
    if (newHP == hp) {
      return;
    }
    if (newHP > 100) {
      return;
    }
    // Send it
    // Refresh hp
    // Change out of edit mode
    setEditHP(false);
  }

  return (
    <div className="stats">
      <Title title={"STATS"}></Title>
      <div id="hp-container">
        {/*<FontAwesomeIcon icon={faPencil} />*/}
        <span>HP</span>

        <span>
          {editHP ? (
            <span className="hp">
              <FontAwesomeIcon icon={faCheck} onClick={onSubmitHP} />
              <input
                name="hp"
                value={newHP !== null ? newHP : hp}
                onChange={onChangeHP}
                type="text"
              ></input>
            </span>
          ) : (
            <span className="hp hp-label" onClick={() => setEditHP(true)}>
              {hp}
            </span>
          )}{" "}
          / 100
        </span>
      </div>
      <div className="limbs stats-container">
        <Limb
          limb="head"
          limbHurt={limbsHurt ? limbsHurt.head.status : 0}
        ></Limb>
        <Limb
          limb="torso"
          limbHurt={limbsHurt ? limbsHurt.torso.status : 0}
        ></Limb>
        <Limb
          limb="leftArm"
          limbHurt={limbsHurt ? limbsHurt.leftarm.status : 0}
        ></Limb>
        <Limb
          limb="rightArm"
          limbHurt={limbsHurt ? limbsHurt.rightarm.status : 0}
        ></Limb>
        <Limb
          limb="leftLeg"
          limbHurt={limbsHurt ? limbsHurt.leftleg.status : 0}
        ></Limb>
        <Limb
          limb="rightLeg"
          limbHurt={limbsHurt ? limbsHurt.rightleg.status : 0}
        ></Limb>

        <div className="face limb">
          <img src={Face} alt="Face" />
        </div>
      </div>
    </div>
  );
}

export default Stats;
