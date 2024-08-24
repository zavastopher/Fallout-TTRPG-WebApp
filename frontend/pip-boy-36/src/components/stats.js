import { useEffect } from "react";
import Limb from "./limb";
import Title from "./title";
import axios from "axios";

//import { useState } from "react";

function Stats({ hp, limbsHurt }) {
  const Face = "./pipboy/fullFace.png";

  return (
    <div className="stats">
      <Title title={"STATS"}></Title>
      <div id="hp">
        <span>HP</span>
        <span>{hp} / 100</span>
      </div>
      <div className="limbs stats-container">
        <Limb limb="head" limbHurt={limbsHurt.head}></Limb>
        <Limb limb="torso" limbHurt={limbsHurt.torso}></Limb>
        <Limb limb="leftArm" limbHurt={limbsHurt.leftArm}></Limb>
        <Limb limb="rightArm" limbHurt={limbsHurt.rightArm}></Limb>
        <Limb limb="leftLeg" limbHurt={limbsHurt.leftLeg}></Limb>
        <Limb limb="rightLeg" limbHurt={limbsHurt.rightLeg}></Limb>

        <div className="face limb">
          <img src={Face} alt="Face" />
        </div>
      </div>
    </div>
  );
}

export default Stats;
