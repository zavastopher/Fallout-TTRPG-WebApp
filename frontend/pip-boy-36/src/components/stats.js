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
        <Limb limb="head" limbHurt={limbsHurt.head.status}></Limb>
        <Limb limb="torso" limbHurt={limbsHurt.torso.status}></Limb>
        <Limb limb="leftArm" limbHurt={limbsHurt.leftarm.status}></Limb>
        <Limb limb="rightArm" limbHurt={limbsHurt.rightarm.status}></Limb>
        <Limb limb="leftLeg" limbHurt={limbsHurt.leftleg.status}></Limb>
        <Limb limb="rightLeg" limbHurt={limbsHurt.rightleg.status}></Limb>

        <div className="face limb">
          <img src={Face} alt="Face" />
        </div>
      </div>
    </div>
  );
}

export default Stats;
