import React from "react";
import TaskColumnRows from "./taskColumnRows";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

export default function TaskColumnRowCon({
  title,
  tasks,
  removeTask,
  updateTask,
  addTask,
  toggleDone,
}) {
  //tasks is a list of javascript objects with the following properties
  //id: String, done String, inhalt String, kategorie String
  //title is a string with the category name

  let temp = 0;
  tasks = tasks || [];
  temp = tasks.length;
  for (let i = temp; i < 11; i++) {
    tasks.push({
      id: uuidv4(),
      kategorie: "placeholder",
      inhalt: "",
      done: "",
    });
  }

  return (
    <Droppable droppableId={title}>
      {(provided) => (
        <ul
          style={{ margin: "0px", padding: "0px" }}
          className="tasks"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {tasks.map((item, index) => {
            return (
              <Draggable
                key={item["id"]}
                draggableId={item["id"].toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskColumnRows
                      index={index}
                      title={title}
                      task={item}
                      removeTask={removeTask}
                      addTask={addTask}
                      updateTask={updateTask}
                      toggleDone={toggleDone}
                    />
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
}
