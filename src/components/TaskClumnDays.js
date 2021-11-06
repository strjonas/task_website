import React from "react";
import TaskColumnRowCon from "./taskColumnRowCon";

export default function TaskClumnDays({
  title,
  object,
  addTask,
  updateTask,
  reorderTasks,
  removeTask,
  toggleDone,
}) {
  //object is a javascript object with the following properties
  //id: String, done String, inhalt String, kategorie String
  //title is a string with the category name
  let objectDays = object;
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  function monthNumToName(monthnum) {
    return months[monthnum - 1] || "";
  }
  return (
    <div
      className="Task-Column"
      style={{
        margin: "10px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: "20px", textTransform: "uppercase" }}>
            {title.split("-")[3]}{" "}
          </div>
          <div style={{ fontSize: "11px" }}>
            {title.split("-")[2] +
              "." +
              monthNumToName(title.split("-")[1]) +
              " " +
              title.split("-")[0]}
          </div>
        </div>
      </div>

      <div>
        <TaskColumnRowCon
          title={title}
          tasks={objectDays}
          removeTask={removeTask}
          addTask={addTask}
          updateTask={updateTask}
          toggleDone={toggleDone}
          reorderTasks={reorderTasks}
        />
      </div>
    </div>
  );
}
