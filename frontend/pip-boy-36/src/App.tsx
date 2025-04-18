// Libraries
import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Socket, io } from "socket.io-client";

// Components
import { Main } from "./components/main";
import { Login } from "./components/login";

// Import Stylesheets
import "./App.css";
import "./App.scss";
import React from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { User } from "./components/types";

/**
 * IO Socket variable
 */
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

/**
 * Top level react component.
 * Responsible for handling references to the self and current selected user.
 * Also handles login and logout for self.
 * @returns
 */

function App() {
  // --------------------------------------------------------
  // Members
  // --------------------------------------------------------
  const [self, setSelf] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(
    !self ? null : self.isadmin ? null : self
  );
  const [playerList, setPlayerList] = useState<Array<User>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // --------------------------------------------------------
  // Functions
  // --------------------------------------------------------

  const changeLimbStatus = useCallback(
    (limb: string, status: number) => {
      if (currentUser) {
        if (currentUser.limbsHurt) {
          const changedList = { ...currentUser.limbsHurt };

          let limbKey = limb.toLowerCase() as keyof typeof changedList;

          changedList[limbKey].status = status;
          setCurrentUser({ ...currentUser, limbsHurt: changedList });
        }
      } else {
        if (self && self.limbsHurt) {
          const changedList = { ...self.limbsHurt };

          let limbKey = limb.toLowerCase() as keyof typeof changedList;

          changedList[limbKey].status = status;
          setSelf({ ...self, limbsHurt: changedList });
        }
      }
    },
    [currentUser, self]
  );

  async function logMeIn(event: MouseEvent, name: string) {
    event.preventDefault();
    console.log(`${process.env.REACT_APP_BASEURL}`);
    let selfHolder: User = {
      id: 0,
      name: "",
      isadmin: false,
      hp: 0,
      maxhp: 0,
      limbsHurt: null,
    };

    try {
      await axios
        .post(`${process.env.REACT_APP_BASEURL}/login`, {
          playername: name,
        })
        .then((response) => {
          console.log(response.data);
          selfHolder = response.data;
        })
        .then(() => {
          return axios.get(
            `${process.env.REACT_APP_BASEURL}/players/limbs/${selfHolder.id}`,
            {}
          );
        })
        .then((response) => {
          var hurtLimbs = response.data[selfHolder.name];
          setSelf({ ...selfHolder, limbsHurt: hurtLimbs });
          console.log("logged in!");
        })
        .catch((error) => {
          console.log("Login Failed!");
          console.log(error);
        });

      if (selfHolder.isadmin) {
        await axios
          .get(`${process.env.REACT_APP_BASEURL}/players`, {})
          .then((response) => {
            setPlayerList([...response.data]);
          })
          .catch((error) => {
            console.log("Could not retrieve players");
          });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        //console.log(error.response);
        console.log(error.message);
      } else {
        console.log("Didn't get a response");
      }

      return false;
    }
  }

  function logMeOut() {
    axios
      .post(`${process.env.REACT_APP_BASEURL}/logout`, {})
      .then((response) => {
        console.log(response.data);
        setSelf(null);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Updates the current user and runs associated tasks with changing the
   * current viewed user.
   * Only ever run when a user is selected by the admin select dropdown.
   * Note: currentUser is stil cached for the function runtime
   * @param {User} user The new user to be set
   */
  async function updateCurrentUser(user: User) {
    if (user) {
      let userCopy = { ...user };

      // First update the cached limbs for the incoming user
      await axios
        .get(`${process.env.REACT_APP_BASEURL}/players/limbs/${user.id}`, {})
        .then((response) => {
          var hurtLimbs = response.data[userCopy.name];
          userCopy.limbsHurt = hurtLimbs;
        });

      // Then set current user to the new user
      setCurrentUser(userCopy);
    } else {
      setCurrentUser(null);
    }
  }

  // --------------------------------------------------------
  // Effects
  // --------------------------------------------------------

  // Good useEffect for fetching self on page refresh
  useEffect(() => {
    setLoading(true);
    console.log("getting self");
    //let selfHolder: User | null = {
    //  id: 0,
    //  name: "",
    //  isadmin: false,
    //  hp: 0,
    //  maxhp: 0,
    //  limbsHurt: null,
    //};

    let selfHolder: User | null = null;

    axios
      .get(`${process.env.REACT_APP_BASEURL}/self`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log("logged in");
        selfHolder = response.data;
      })
      .then(() => {
        if (!selfHolder) throw new Error("Not logged in");
        return axios.get(
          `${process.env.REACT_APP_BASEURL}/players/limbs/${selfHolder.id}`,
          {}
        );
      })
      .then((response) => {
        if (!selfHolder) throw new Error("Not logged in");

        var hurtLimbs = response.data[selfHolder.name];
        selfHolder.limbsHurt = hurtLimbs;
      })
      .catch(() => {
        console.log("You are not logged in!");
      })
      .then(() => {
        if (selfHolder && selfHolder.isadmin) {
          console.log("getting players");
          return axios.get(`${process.env.REACT_APP_BASEURL}/players`, {});
        }
        return null;
      })
      .then((response) => {
        if (response) {
          setPlayerList([...response.data]);
        }
      })
      .finally(() => {
        setLoading(false);
        setSelf(selfHolder);
      });
  }, []);

  // Good useEffect for syncing socket stuff
  useEffect(() => {
    // create websocket/connect
    socket = io(window.location.hostname + ":4001");
    //console.log();

    socket.on("connect", function() {
      console.log("connected!");
    });

    socket.on("hp", (hp) => {
      console.log("hp" + hp.hp);

      if (currentUser) {
        setCurrentUser((val) => {
          if (!val) {
            return null;
          }
          return { ...val, hp: hp.hp };
        });
      } else {
        setSelf((val) => {
          if (!val) {
            return null;
          }
          return { ...val, hp: hp.hp };
        });
      }
    });

    socket.on("maxhp", (maxhp) => {
      console.log(maxhp);
      if (currentUser) {
        setCurrentUser((val) => {
          if (!val) {
            return null;
          }
          return { ...val, maxhp: maxhp.maxhp };
        });
      } else {
        setSelf((val) => {
          if (!val) {
            return null;
          }
          return { ...val, maxhp: maxhp.maxhp };
        });
      }
    });

    socket.on("limb", ({ limb, status }) => {
      console.log("limb change");

      changeLimbStatus(limb, status);
    });

    // when component unmounts, disconnect
    return () => {
      socket.disconnect();
    };
  }, [changeLimbStatus]);

  return (
    <div className="App crt crt-scanlines">
      <div id="scan"></div>
      <header className="App-header">
        {loading ? (
          <div className="loading"> Loading</div>
        ) : !self && self !== "" && self !== undefined ? (
          <Login logMeIn={logMeIn} />
        ) : (
          <>
            <Main
              self={self}
              currentUser={currentUser}
              logMeOut={logMeOut}
              updateCurrentUser={updateCurrentUser}
              playerList={playerList}
            ></Main>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
