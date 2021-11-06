import React, { Fragment, useState } from "react";
import { MdModeEdit } from "react-icons/md";

const EditTodo = ({ obj, updateTask }) => {
  const [inhalt, setinhalt] = useState(
    obj.inhalt
      .replaceAll("<em>", "***")
      .replaceAll("<strong>", "**")
      .replaceAll("<u>", "&&")
  );
  if (inhalt === null) setinhalt("");
  const updateinhalt = async (e) => {
    e.preventDefault();
    updateTask(obj, inhalt);
  };

  return (
    <Fragment>
      <MdModeEdit
        type="button"
        data-toggle="modal"
        data-target={`#id${obj["id"]}`}
      ></MdModeEdit>

      <div
        className="modal"
        id={`id${obj["id"]}`}
        onClick={() => setinhalt(obj.inhalt)}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Todo</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => setinhalt(obj.inhalt)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                value={inhalt}
                onChange={(e) => setinhalt(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                data-dismiss="modal"
                onClick={(e) => updateinhalt(e)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={() => setinhalt(obj.inhalt)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditTodo;
