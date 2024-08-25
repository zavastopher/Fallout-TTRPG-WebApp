import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import { useRef } from "react";
import gsap, { Power2 } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

function ContextMenu(props, submitFunciton) {
  var SELECTOR_SCREEN_ELEMENT = ".context-menu";

  const [menuVisibility, setMenuVisibility] = useState(true);

  const timeline = useRef();
  const [isTurnedOn, setIsTurnedOn] = useState(true);
  const container = useRef();

  function onToggle() {
    //menuVisibility ? setMenuVisibility(false) : setMenuVisibility(true);
    toggleSwitcherTV();
  }

  useGSAP(
    () => {
      timeline.current = gsap
        .timeline({ paused: true })
        .to(".context-menu", {
          duration: 0.2,
          width: "30vw",
          height: "2px",
          backgroundColor: "#ffffff",
          ease: Power2.easeOut,
        })
        .to(".context-menu", {
          duration: 0.2,
          width: "0",
          height: "0",
          backgroundColor: "#ffffff",
        });
    },
    { scope: container }
  ); // <-- scope is for selector text (optional)

  //  useEffect(() => {
  //    let ctx = gsap.context(() => {
  //      // normal selector text, automatically scoped to appRef
  //      gsap.from(".box", {
  //        duration: 2,
  //        width: 0,
  //        ease: "power3.inOut",
  //      });
  //    }, container);

  //    return () => ctx.revert();
  //  }, []);

  //  useGSAP(() => {
  //timeline = gsap.timeline({ paused: true });
  //timeline
  //  .to(SELECTOR_SCREEN_ELEMENT, {
  //    duration: 0.2,
  //    width: "100vw",
  //    height: "2px",
  //    backgroundColor: "#ffffff",
  //    ease: Power2.easeOut,
  //  })
  //  .to(SELECTOR_SCREEN_ELEMENT, {
  //    duration: 0.2,
  //    width: "0",
  //    height: "0",
  //    backgroundColor: "#ffffff",
  //  });
  //  });

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
      <div className="context-menu">
        {props.children}
        <button className="context-submit">Submit</button>
      </div>
      <div className="context-toggle-button" onClick={toggleSwitcherTV}>
        <span>+</span>
      </div>
    </div>
  );
}

export default ContextMenu;
