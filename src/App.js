import "./style/index.scss";
import React, { useState } from "react";
import TaskHandler from "./components/TaskHandler";
import AuthHandler from "./components/AuthHandler";

function App() {
  const [auth, setAuth] = useState(localStorage.getItem("token") !== null);
  return (
    <>
      {auth ? (
        <TaskHandler setAuth={setAuth} />
      ) : (
        <AuthHandler setAuth={setAuth} />
      )}
    </>
  );
}
export default App;
