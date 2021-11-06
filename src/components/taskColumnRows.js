import React, { useState, Fragment } from "react";
import { MdDelete } from "react-icons/md";
import EditTodo from "./editTask";

export default function TaskColumnRows({
  title,
  task,
  removeTask,
  updateTask,
  toggleDone,
  addTask,
}) {
  //task is a javascript object with the following properties
  //id: String, done String, inhalt String, kategorie String
  //title is a string with the category name

  let icon;
  let row;
  let crossedOrNot;
  const [val, setVal] = useState([]);
  const [refresher, setRefresher] = useState(false);

  function onTextChange(e) {
    setVal(e.target.value);
  }
  function onLooseFocus(e) {
    if (e.target.value !== "") {
      addTask(val, title);
    }
  }
  function cb_refreshState() {
    task["done"] = !task["done"];
    setRefresher(!refresher);
  }

  function donetoggle(e) {
    toggleDone(task, cb_refreshState);
  }
  function removeTaskhere(e) {
    removeTask(task);
  }
  const handleInput = (e) => {
    if (e.key === "Enter") {
      addTask(val, title);
      e.target.value = "";
    }
  };

  if (updateTask === null) updateTask = undefined;
  if (task === null) task = undefined;
  task["inhalt"] = task["inhalt"]

    .replaceAll(";", "")
    .replaceAll("***", "<em>")
    .replaceAll("**", "<strong>")
    .replaceAll("&&", "<u>");
  if (!task["done"]) {
    icon = (
      <EditTodo obj={task} updateTask={updateTask} className="icon-Button" />
    );
    crossedOrNot = (
      <div
        id={`${refresher}`}
        dangerouslySetInnerHTML={{ __html: task["inhalt"] }}
        onClick={donetoggle}
        className="divtextrow"
      ></div>
    );
  } else {
    icon = <MdDelete onClick={removeTaskhere} className="icon-Button" />;
    crossedOrNot = (
      <div id={`${refresher}`} onClick={donetoggle} className="divtextrow">
        <del dangerouslySetInnerHTML={{ __html: task["inhalt"] }}></del>
      </div>
    );
  }

  task["inhalt"] === ""
    ? (row = (
        <input
          className="textInTaskRow inputRow"
          style={{
            display: "inline-block",
            border: "1px solid #212222",
            borderLeft: "none",
            borderRight: "none",
            borderTop: "none",
            color: "#E8E6E3",
            borderRadius: "2px",
            boxSizing: "border-box",
            backgroundColor: "#181A1B",
          }}
          type="text"
          value={val}
          onKeyPress={(e) => handleInput(e)}
          onChange={onTextChange}
          onBlur={onLooseFocus}
        ></input>
      ))
    : (row = (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "2px",
          }}
        >
          {crossedOrNot}
          {icon}
        </div>
      ));

  return (
    <Fragment>
      <div className="taskRow">{row}</div>
    </Fragment>
  );
}
