import "./style/index.scss";
import React from "react";
import ReactDOM from "react-dom";
import "./style/index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

try {
  ReactDOM.render(<App />, document.getElementById("root"));
} catch (error) {
  alert("ERROR! Make sure you have a functioning internet connection!");
}
