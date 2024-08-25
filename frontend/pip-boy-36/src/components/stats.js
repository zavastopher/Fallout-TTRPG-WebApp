import Limb from "./limb";
import Title from "./title";

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
