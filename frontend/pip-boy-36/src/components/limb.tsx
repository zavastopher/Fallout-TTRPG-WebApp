// Libraries
import { faBone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type LimbProps = {
  limb: string;
  limbHurt: string;
  UpdateLimb: Function;
};

export function Limb({ limb, limbHurt, UpdateLimb }: LimbProps) {
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
