// Libraries
import React from "react";
import { useState } from "react";

type LoginProps = {
  logMeIn: Function;
};

export function Login({ logMeIn }: LoginProps) {
  // --------------------------------------------------------
  // Members
  // --------------------------------------------------------
  const [name, setName] = useState("");

  const [errorMsg, setErrorMessage] = useState("");

  // --------------------------------------------------------
  // Functions
  // --------------------------------------------------------

  function handleChange(event: React.FormEvent<HTMLInputElement>) {
    setName(event.currentTarget.value);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      await logMeIn(event, name);
      setName("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Unable to Login");
    }
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
