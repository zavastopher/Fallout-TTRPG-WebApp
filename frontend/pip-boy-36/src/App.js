import "./App.css";
import "./App.scss";
import Main from "./components/main";
import Login from "./components/login";
import { useState } from "react";
import axios from "axios";

/**
 * Login stuff should be here!
 * @returns
 */

function App() {
  //const { token, removeToken, setToken } = useToken();
  const [self, setSelf] = useState(null);

  async function logMeIn(event, name) {
    event.preventDefault();

    try {
      return await axios
        .post(`${process.env.REACT_APP_BASEURL}/login`, {
          playername: name,
        })
        .then((response) => {
          console.log(response.data);
          getSelf();
        });
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

  function getSelf() {
    axios
      .get(`${process.env.REACT_APP_BASEURL}/self`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setSelf(response.data);
      })
      .catch(() => {});
  }

  return (
    <div className="App crt crt-scanlines">
      <div id="scan"></div>
      <header className="App-header">
        {!self && self !== "" && self !== undefined ? (
          <Login logMeIn={logMeIn} />
        ) : (
          <>
            <Main self={self} refreshSelf={getSelf} logMeOut={logMeOut}></Main>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
