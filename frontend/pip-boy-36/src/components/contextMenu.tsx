// Libraries
import { useState } from "react";
import { useRef } from "react";
import gsap, { Power2 } from "gsap";
import { useGSAP } from "@gsap/react";
import React from "react";

gsap.registerPlugin(useGSAP);

type ContextMenuProps = {
  submitFunction: React.FormEventHandler<HTMLFormElement> | undefined;
  children: JSX.Element;
};

export function ContextMenu(props: ContextMenuProps) {
  // --------------------------------------------------------
  // Members
  // --------------------------------------------------------
  var SELECTOR_SCREEN_ELEMENT = ".context-menu";

  const timeline = useRef(gsap.timeline({ paused: true }));
  const [isTurnedOn, setIsTurnedOn] = useState(true);
  const container = useRef(null);

  // --------------------------------------------------------
  // Hooks
  // --------------------------------------------------------
  useGSAP(
    () => {
      if (timeline) {
        timeline.current
          .to(SELECTOR_SCREEN_ELEMENT, {
            duration: 0.2,
            width: "0",
            height: "0",
            backgroundColor: "#ffffff",
            ease: Power2.easeOut,
          })
          .to(SELECTOR_SCREEN_ELEMENT, {
            duration: 0.1,
            delay: 0.1,
            padding: "10px",
            width: "400px",
            color: "white",
            ease: Power2.easeOut,
          })
          .to(SELECTOR_SCREEN_ELEMENT, {
            duration: 0.1,
            overflow: "hidden",
            height: "0",
            minHeight: "0",
            color: "white",
            ease: Power2.easeOut,
          })

          .to(SELECTOR_SCREEN_ELEMENT, {
            duration: 0.1,
            width: "400px",
            height: "100%",
            minHeight: "100%",
            padding: "10px 10px 30px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "inherit",
            overflow: "visible",
            ease: Power2.easeOut,
          });
      }
    },
    { scope: container }
  ); // <-- scope is for selector text (optional)

  // --------------------------------------------------------
  // Functions
  // --------------------------------------------------------
  const { contextSafe } = useGSAP(() => {}, { scope: container });

  const toggleSwitcherTV = contextSafe(() => {
    if (timeline && timeline !== undefined) {
      console.log("toggle");

      if (isTurnedOn) {
        timeline?.current?.restart();
      }

      if (!isTurnedOn) {
        timeline?.current?.reverse();
      }

      setIsTurnedOn(!isTurnedOn);
    }
  }) as React.MouseEventHandler;

  return (
    <div ref={container} className={`context-menu-container `}>
      <form className="context-menu" onSubmit={props.submitFunction}>
        {props.children}
        <button type="submit" className="context-submit">
          Submit
        </button>
      </form>
      <div className="context-toggle-button" onClick={toggleSwitcherTV}>
        <span>+</span>
      </div>
    </div>
  );
}
