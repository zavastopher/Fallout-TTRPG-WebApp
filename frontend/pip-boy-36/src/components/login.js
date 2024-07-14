import { useState } from "react";
import Navbar from "./navbar";
import axios from "axios";

var baseURL = "http://localhost";

function Login({ setToken }) {
  const [name, setName] = useState("");

  const [errorMsg, setErrorMessage] = useState("");

  function logMeIn(event) {
    axios
      .post(`${baseURL}/api/login`, {
        playername: name,
      })
      .then((response) => {
        console.log(response.data);
        setToken(response.data.access_token);
        setErrorMessage("");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          console.log("Didn't get a response");
        }
        setErrorMessage("Unable to Login");
      });

    setName("");

    event.preventDefault();
  }

  function handleChange(event) {
    console.log("change!!");
    setName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(`Submit name:  ${name}`);

    logMeIn(event);

    console.log("Oh boy");
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={handleChange}></input>
        <input type="submit" value="Submit"></input>
      </form>
      <p>{errorMsg}</p>
    </div>
  );
}

export default Login;
