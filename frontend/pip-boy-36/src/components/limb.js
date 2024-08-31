// Libraries
import { faBone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Limb({ limb, limbHurt, UpdateLimb }) {
  return (
    <div className={`limb ${limb}`}>
      <img
        src={`./pipboy/${limb.toLowerCase()}/${limbHurt ? "hurt" : "full"}${
          limb.charAt(0).toUpperCase() + limb.slice(1)
        }.png`}
        alt={`${limb}`}
      />

      <div className={`limbButton ${limb}`} onClick={() => UpdateLimb(limb)}>
        <FontAwesomeIcon icon={faBone} />
      </div>
    </div>
  );
}
