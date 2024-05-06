import pip from "../assets/images/pip-boy.svg";
import Title from "./title";

function Stats() {
  return (
    <div>
      <Title title={"STATS"}></Title>
      <div className="stats-container">
        <span>HP: 100 / 100</span>
        <div className="pipboy">
          <div
            style={{
              maskImage: `url(${pip})`,
              WebkitMaskImage: `url(${pip})`,
            }}
            id="pipIcon"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
