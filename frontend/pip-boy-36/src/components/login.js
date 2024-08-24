import { useState } from "react";
import Navbar from "./navbar";
import axios from "axios";

var baseURL = "http://localhost/api";

function Login({ logMeIn }) {
  const [name, setName] = useState("");

  const [errorMsg, setErrorMessage] = useState("");

  function handleChange(event) {
    //console.log("change!!");
    setName(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    //console.log(`Submit name:  ${name}`);

    try {
      await logMeIn(event, name);
      setName("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Unable to Login");
    }
    //console.log("Oh boy");
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
