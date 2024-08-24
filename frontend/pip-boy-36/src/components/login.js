import { useState } from "react";

function Login({ logMeIn }) {
  const [name, setName] = useState("");

  const [errorMsg, setErrorMessage] = useState("");

  function handleChange(event) {
    setName(event.target.value);
  }

  async function handleSubmit(event) {
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

export default Login;
