// Libraries
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

// Components
import { Main } from "./components/main";
import { Login } from "./components/login";

// Import Stylesheets
import "./App.css";
import "./App.scss";

/**
 * IO Socket variable
 */
let socket;

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
  const [self, setSelf] = useState("");
  const [currentUser, setCurrentUser] = useState(
    !self ? null : self.isadmin ? null : self
  );
  const [playerList, setPlayerList] = useState([]);
  const [loading, setLoading] = useState(true);

  const userBools = {
    adminHasSelectedUser: self ? self.isadmin && currentUser : null,
    playerIsFocusedUser: self ? !self.isadmin || currentUser : null,
  };

  // --------------------------------------------------------
  // Functions
  // --------------------------------------------------------

  const changeLimbStatus = useCallback(
    (limb, status) => {
      if (currentUser) {
        const changedList = { ...currentUser.limbsHurt };
        changedList[limb].status = status;
        setCurrentUser({ ...currentUser, limbsHurt: changedList });
      } else {
        const changedList = { ...self.limbsHurt };
        changedList[limb].status = status;
        setSelf({ ...self, limbsHurt: changedList });
      }
    },
    [currentUser, self]
  );

  async function logMeIn(event, name) {
    event.preventDefault();
    let selfHolder;

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
    } catch (error) {
      if (error.response) {
        //console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
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
  async function updateCurrentUser(user) {
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
    var selfHolder = null;
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
        return axios.get(
          `${process.env.REACT_APP_BASEURL}/players/limbs/${selfHolder.id}`,
          {}
        );
      })
      .then((response) => {
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
    socket = io("localhost:4001");

    socket.on("connect", function () {
      console.log("connected!");
    });

    socket.on("hp", (hp) => {
      setSelf((s) => ({ ...s, hp: hp }));
    });

    socket.on("maxhp", (maxhp) => {
      setSelf((s) => ({ ...s, maxhp: maxhp }));
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
              userBools={userBools}
              playerList={playerList}
            ></Main>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
