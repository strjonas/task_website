import { color } from "@material-ui/system";
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
  moveDayBack,
  moveDayUp,
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
  // function that gets the current date in the format of year-month-day-dayOfWeek
  function getDate() {
    var today = new Date();
    var dd = String(today.getDate());
    var mm = String(today.getMonth() + 1); //January is 0!
    var yyyy = today.getFullYear();
    var dayOfWeek = today.getDay();
    var dayOfWeekString = "";
    switch (dayOfWeek) {
      case 0:
        dayOfWeekString = "Sunday";
        break;
      case 1:
        dayOfWeekString = "Monday";
        break;
      case 2:
        dayOfWeekString = "Tuesday";
        break;
      case 3:
        dayOfWeekString = "Wednesday";
        break;
      case 4:
        dayOfWeekString = "Thursday";
        break;
      case 5:
        dayOfWeekString = "Friday";
        break;
      case 6:
        dayOfWeekString = "Saturday";
        break;
      default:
        dayOfWeekString = "";
    }
    return yyyy + "-" + mm + "-" + dd + "-" + dayOfWeekString;
  }

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
          <div
            style={{
              fontSize: "20px",
              textTransform: "uppercase",
              color: `${getDate() === title ? "#ED2939" : "white"}`,
            }}
          >
            {title.split("-")[3]}{" "}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: `${getDate() === title ? "#ED2939" : "white"}`,
            }}
          >
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
          moveDayUp={moveDayUp}
          moveDayBack={moveDayBack}
        />
      </div>
    </div>
  );
}
