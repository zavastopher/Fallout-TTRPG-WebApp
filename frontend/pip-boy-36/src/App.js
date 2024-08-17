import "./App.css";
import "./App.scss";
import Main from "./components/main";
import useToken from "./components/useToken";
import Login from "./components/login";

function App() {
  const { token, removeToken, setToken } = useToken();

  return (
    <div className="App crt crt-scanlines">
      <div id="scan"></div>
      <header className="App-header" token={removeToken}>
        {!token && token !== "" && token !== undefined ? (
          <Login setToken={setToken} />
        ) : (
          <>
            <Main removeToken={removeToken}></Main>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
