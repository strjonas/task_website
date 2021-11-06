import React from "react";
import TaskColumnRowCon from "./taskColumnRowCon";
import { MdClose } from "react-icons/md";

export default function TaskColumnOthers({
  title,
  object,
  addTask,
  updateTask,
  deletekategorie,
  reorderTasks,
  removeTask,
  toggleDone,
}) {
  //object is a javascript object with the following properties
  //id: String, done String, inhalt String, kategorie String
  //title is a string with the category name

  function deletekategoriehere() {
    let kategorie = title;
    deletekategorie(kategorie);
  }
  return (
    <div
      className="Task-Column"
      style={{
        margin: "10px",
      }}
    >
      <MdClose onClick={deletekategoriehere} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            fontSize: "20px",
            textTransform: "uppercase",
            paddingBottom: "5px",
          }}
        >
          {title}
        </div>
      </div>

      <div>
        <TaskColumnRowCon
          title={title}
          tasks={object}
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
