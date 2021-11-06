import React from "react";

function RegisterForm({ setAuth, setLogin }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const API = process.env.REACT_APP_API;

  function handleChangeEmail(event) {
    setEmail(event.target.value);
  }
  function handleChangePassword(event) {
    setPassword(event.target.value);
  }
  function register() {
    fetch(`http://${API}/register`, {
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
  }
  return (
    <div>
      <input value={email} onChange={handleChangeEmail} type="email"></input>
      <input
        value={password}
        onChange={handleChangePassword}
        type="password"
      ></input>
      <button onClick={register}>Register</button>
      <button onClick={setLogin}>Login</button>
    </div>
  );
}

export default RegisterForm;
