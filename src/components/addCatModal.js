import React, { Fragment, useState } from "react";
import { MdAdd } from "react-icons/md";

const AddCatModal = ({ obj, addCat }) => {
  const [inhalt, setinhalt] = useState(obj.inhalt);
  if (inhalt === null) setinhalt("");
  const addCathere = async (e) => {
    e.preventDefault();
    addCat(inhalt);
  };

  return (
    <Fragment>
      <MdAdd
        style={{
          color: "red",
          width: "50px",
          height: "30px",
        }}
        type="button"
        data-toggle="modal"
        data-target={`#id${obj["id"]}`}
      />

      <div
        className="modal"
        id={`id${obj["id"]}`}
        onClick={() => setinhalt(obj.inhalt)}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Column</h4>
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
                onClick={(e) => addCathere(e)}
              >
                Add
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

export default AddCatModal;
