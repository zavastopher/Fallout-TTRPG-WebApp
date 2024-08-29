import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import { useRef } from "react";
import gsap, { Power2 } from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

function ContextMenu(props) {
  var SELECTOR_SCREEN_ELEMENT = ".context-menu";

  const [menuVisibility, setMenuVisibility] = useState(true);

  const timeline = useRef();
  const [isTurnedOn, setIsTurnedOn] = useState(true);
  const container = useRef();

  function onToggle() {
    //menuVisibility ? setMenuVisibility(false) : setMenuVisibility(true);
    toggleSwitcherTV();
  }

  //useGSAP(
  //  () => {
  //    timeline.current = gsap
  //      .timeline({ paused: true })
  //      .to(".context-menu", {
  //        duration: 0.1,
  //        width: "400px",
  //        height: "100%",
  //        minHeight: "100%",
  //        padding: "10px",
  //        backgroundColor: "#ffffff",
  //        color: "inherit",
  //        overflow: "visible",
  //        ease: Power2.easeOut,
  //      })
  //      .to(".context-menu", {
  //        duration: 0.2,
  //        minHeight: "0px",
  //        height: "0",
  //        overflow: "hidden",
  //      })
  //      .to(".context-menu", {
  //        duration: 0.2,
  //        padding: "0",
  //        color: "white",
  //        ease: Power2.easeOut,
  //      })
  //      .to(".context-menu", {
  //        duration: 0.5,
  //        delay: 0.2,
  //        width: "0",
  //        height: "0",
  //        backgroundColor: "#ffffff",
  //      });
  //  },
  //  { scope: container }
  //); // <-- scope is for selector text (optional)

  // This one
  useGSAP(
    () => {
      timeline.current = gsap
        .timeline({ paused: true })
        .to(".context-menu", {
          duration: 0.2,
          width: "0",
          height: "0",
          backgroundColor: "#ffffff",
          ease: Power2.easeOut,
        })
        .to(".context-menu", {
          duration: 0.1,
          delay: 0.1,
          padding: "10px",
          width: "400px",
          color: "white",
          ease: Power2.easeOut,
        })
        .to(".context-menu", {
          duration: 0.1,
          overflow: "hidden",
          height: "0",
          minHeight: "0",
          color: "white",
          ease: Power2.easeOut,
        })

        .to(".context-menu", {
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
    },
    { scope: container }
  ); // <-- scope is for selector text (optional)

  const { contextSafe } = useGSAP({ scope: container });

  const toggleSwitcherTV = contextSafe(() => {
    console.log("toggle");

    if (isTurnedOn) {
      timeline.current.restart();
    }

    if (!isTurnedOn) {
      timeline.current.reverse();
    }

    setIsTurnedOn(!isTurnedOn);
  });

  return (
    <div
      ref={container}
      className={`context-menu-container ${
        menuVisibility ? "context-open" : "context-closed"
      }`}
    >
      <form className="context-menu" onSubmit={props.submitFunction}>
        {props.children}
        {/*<input className="context-submit" value="Submit" type="submit" />*/}
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

export default ContextMenu;
