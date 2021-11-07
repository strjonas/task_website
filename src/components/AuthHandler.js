import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./AuthHandler.scss";

function AuthHandler({ setAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  function setLogin() {
    setIsLogin(!isLogin);
  }
  return (
    <>
      {isLogin ? (
        <LoginForm setAuth={setAuth} setLogin={setLogin} />
      ) : (
        <RegisterForm setAuth={setAuth} setLogin={setLogin} />
      )}
    </>
  );
}

export default AuthHandler;
