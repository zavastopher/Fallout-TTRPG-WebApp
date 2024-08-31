// Libraries
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Components
import { Limb } from "./limb";
import { Title } from "./title";

export function Stats({ hp, maxhp, limbsHurt, self, currentUser, userBools }) {
  // --------------------------------------------------------
  // Members
  // --------------------------------------------------------
  const Face = "./pipboy/fullFace.png";
  const [editHP, setEditHP] = useState(false);
  const [newHP, setNewHP] = useState(null);

  const [editMaxHP, setEditMaxHP] = useState(false);
  const [newMaxHP, setNewMaxHP] = useState(null);

  // --------------------------------------------------------
  // Functions
  // --------------------------------------------------------

  function onChangeHP(event) {
    const value = event.target.value;
    setNewHP(value);
  }

  function onChangeMaxHP(event) {
    const value = event.target.value;
    setNewMaxHP(value);
  }

  function onSubmitHP(event) {
    // Validate HP (Check if it is different or allowed)
    if (newHP === hp) {
      setEditHP(false);
      return;
    }
    if (newHP > maxhp) {
      return;
    }
    // Send it
    // Refresh hp
    // Change out of edit mode
    console.log("hm");
    setEditHP(false);
  }

  function onSubmitMaxHP(event) {
    // Validate HP (Check if it is different or allowed)
    if (newMaxHP === maxhp) {
      setEditMaxHP(false);
      return;
    }
    // Send it
    // Refresh hp
    // Change out of edit mode
    setEditMaxHP(false);
  }

  function UpdateLimb(limb) {
    console.log(limb.toLowerCase());
    console.log(limbsHurt);
    console.log(self);

    if (currentUser) {
      axios
        .put(
          `${process.env.REACT_APP_BASEURL}/players/limbs/${currentUser.id}`,
          {
            limbtype: limbsHurt[limb.toLowerCase()].limbtype,
            status: limbsHurt[limb.toLowerCase()].status === 0 ? 1 : 0,
          }
        )
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log("Update Limb Error:");
          console.log(error);
        });
    } else if (!self.isadmin) {
      axios
        .put(`${process.env.REACT_APP_BASEURL}/players/limbs/${self.id}`, {
          limbtype: limbsHurt[limb.toLowerCase()].limbtype,
          status: limbsHurt[limb.toLowerCase()].status === 0 ? 1 : 0,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log("Update Limb Error:");
          console.log(error);
        });
    }
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
            <span
              className="hp hp-label"
              onClick={() => {
                setEditHP(true);
                setEditMaxHP(false);
              }}
            >
              {hp}
            </span>
          )}
          {""}/{""}
          {editMaxHP ? (
            <span className="hp">
              <FontAwesomeIcon icon={faCheck} onClick={onSubmitMaxHP} />
              <input
                name="maxhp"
                value={newMaxHP !== null ? newMaxHP : maxhp}
                onChange={onChangeMaxHP}
                type="text"
              ></input>
            </span>
          ) : (
            <span
              className="hp hp-label"
              onClick={() => {
                setEditMaxHP(true);
                setEditHP(false);
              }}
            >
              {maxhp}
            </span>
          )}
        </span>
      </div>
      {userBools.playerIsFocusedUser ? (
        <div className="limbs stats-container">
          <Limb
            limb="head"
            limbHurt={limbsHurt ? limbsHurt.head.status : 0}
            UpdateLimb={UpdateLimb}
          ></Limb>
          <Limb
            limb="torso"
            limbHurt={limbsHurt ? limbsHurt.torso.status : 0}
            UpdateLimb={UpdateLimb}
          ></Limb>
          <Limb
            limb="leftArm"
            limbHurt={limbsHurt ? limbsHurt.leftarm.status : 0}
            UpdateLimb={UpdateLimb}
          ></Limb>
          <Limb
            limb="rightArm"
            limbHurt={limbsHurt ? limbsHurt.rightarm.status : 0}
            UpdateLimb={UpdateLimb}
          ></Limb>
          <Limb
            limb="leftLeg"
            limbHurt={limbsHurt ? limbsHurt.leftleg.status : 0}
            UpdateLimb={UpdateLimb}
          ></Limb>
          <Limb
            limb="rightLeg"
            limbHurt={limbsHurt ? limbsHurt.rightleg.status : 0}
            UpdateLimb={UpdateLimb}
          ></Limb>

          <div className="face limb">
            <img src={Face} alt="Face" />
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
