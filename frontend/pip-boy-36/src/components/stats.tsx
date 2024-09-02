// Libraries
import { faCheck, faCross, faX } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Components
import { Limb } from "./limb";
import { Title } from "./title";
import { LimbsType, User } from "./types";
import React from "react";

type StatsProps = {
  hp: number;
  maxhp: number;
  limbsHurt: LimbsType | null;
  self: User | null;
  currentUser: User | null;
};

export function Stats({ hp, maxhp, limbsHurt, self, currentUser }: StatsProps) {
  // --------------------------------------------------------
  // Members
  // --------------------------------------------------------
  const Face = "./pipboy/fullFace.png";
  const [editHP, setEditHP] = useState<Boolean>(false);
  const [newHP, setNewHP] = useState<number>(currentUser?.hp ?? self?.hp ?? 0);

  const [editMaxHP, setEditMaxHP] = useState<Boolean>(false);
  const [newMaxHP, setNewMaxHP] = useState<number>(
    currentUser?.maxhp ?? self?.maxhp ?? 0
  );

  const userBools = {
    adminHasSelectedUser: self ? self.isadmin && currentUser : null,
    playerIsFocusedUser: self ? !self.isadmin || currentUser : null,
  };

  // --------------------------------------------------------
  // Functions
  // --------------------------------------------------------

  function onChangeHP(event: React.FormEvent<HTMLInputElement>) {
    if (!Number.isNaN(event.currentTarget.valueAsNumber)) {
      setNewHP(event.currentTarget.valueAsNumber);
    }
  }

  function onChangeMaxHP(event: React.FormEvent<HTMLInputElement>) {
    if (!Number.isNaN(event.currentTarget.valueAsNumber)) {
      setNewMaxHP(event.currentTarget.valueAsNumber);
    }
  }

  function UpdateHP(hp: number) {
    let user: User | null = currentUser ?? self;

    if (!user) return;

    axios
      .put(`${process.env.REACT_APP_BASEURL}/players/hp/${user.id}`, { hp: hp })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function UpdateMaxHP(maxhp: number) {
    let user: User | null = currentUser ?? self;

    if (!user) return;

    axios
      .put(`${process.env.REACT_APP_BASEURL}/players/maxhp/${user.id}`, {
        maxhp: maxhp,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function onSubmitHP() {
    // Validate HP (Check if it is different or allowed)
    if (newHP < 0) {
      alert("Please enter a positive number.");
      return;
    }

    if (newHP === hp) {
      setEditHP(false);
      return;
    }
    if (newHP > maxhp) {
      alert("Please enter a number less than the current max hp.");
      return;
    }
    // Send it

    UpdateHP(newHP);

    // Change out of edit mode
    setEditHP(false);
  }

  function onSubmitMaxHP() {
    // Validate HP (Check if it is different or allowed)
    if (newMaxHP === maxhp) {
      setEditMaxHP(false);
      return;
    }

    // Send it
    UpdateMaxHP(newMaxHP);

    // If maxhp is lower than current hp, lower current hp too
    if (newMaxHP < hp) {
      UpdateHP(newMaxHP);
    }

    // Change out of edit mode
    setEditMaxHP(false);
  }

  function UpdateLimb(limb: string) {
    if (limbsHurt) {
      let limbKey = limb.toLowerCase() as keyof typeof limbsHurt;

      if (currentUser) {
        axios
          .put(
            `${process.env.REACT_APP_BASEURL}/players/limbs/${currentUser.id}`,
            {
              limbtype: limbsHurt[limbKey].limbtype,
              status: limbsHurt[limbKey].status === 0 ? 1 : 0,
            }
          )
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log("Update Limb Error:");
            console.log(error);
          });
      } else if (!self?.isadmin) {
        axios
          .put(`${process.env.REACT_APP_BASEURL}/players/limbs/${self?.id}`, {
            limbtype: limbsHurt[limbKey].limbtype,
            status: limbsHurt[limbKey].status === 0 ? 1 : 0,
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
  }

  return (
    <div className="stats">
      <Title title={"STATS"}></Title>
      <div id="hp-container">
        {/*<FontAwesomeIcon icon={faPencil} />*/}
        <span>HP</span>

        <span className="hp-fields">
          {editHP ? (
            <span className="hp">
              <div className="hp-buttons">
                <FontAwesomeIcon icon={faCheck} onClick={onSubmitHP} />
                <FontAwesomeIcon
                  icon={faX}
                  onClick={() => {
                    setEditHP(false);
                  }}
                />
              </div>
              <input
                name="hp"
                value={newHP}
                onChange={onChangeHP}
                type="number"
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
              <div className="hp-buttons">
                <FontAwesomeIcon icon={faCheck} onClick={onSubmitMaxHP} />
                <FontAwesomeIcon
                  icon={faX}
                  onClick={() => {
                    setEditMaxHP(false);
                  }}
                />
              </div>
              <input
                name="maxhp"
                value={newMaxHP}
                onChange={onChangeMaxHP}
                type="number"
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
