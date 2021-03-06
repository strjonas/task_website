import React from "react";

function LoginForm({ setAuth, setLogin }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const API = process.env.REACT_APP_API;

  function handleChangeEmail(event) {
    setEmail(event.target.value);
  }
  function handleChangePassword(event) {
    setPassword(event.target.value);
  }
  function login() {
    try {
      fetch(`https://${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.token);
          localStorage.setItem("token", data.token);
          setAuth(true);
        });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="outerDiv">
      <div className="Form">
        <input
          placeholder="Email"
          className="emailInput"
          value={email}
          onChange={handleChangeEmail}
          type="email"
        ></input>
        <input
          placeholder="Password"
          className="passwordInput"
          value={password}
          onChange={handleChangePassword}
          type="password"
        ></input>
        <button className="applyButton" onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
