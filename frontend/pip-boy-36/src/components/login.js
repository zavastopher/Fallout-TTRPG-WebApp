import { useState } from "react";
import Navbar from "./navbar";
import axios from "axios";

function Login({ setToken }) {
  const [name, setName] = useState("");

  function logMeIn(event) {
    axios({
      method: "POST",
      url: "/token",
      data: {
        name: name,
      },
    })
      .then((response) => {
        setToken(response.data.access_token);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
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

    if (name.toLowerCase() === "camille") {
      setToken("set");
    }

    console.log("Oh boy");
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={handleChange}></input>
        <input type="submit" value="Submit"></input>
      </form>
    </div>
  );
}

export default Login;
