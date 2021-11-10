import TaskClumnDays from "./TaskClumnDays";
import React, { Component } from "react";
import TaskColumnOthers from "./TaskClumnOthers";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import AddCatModal from "./addCatModal";
import { DragDropContext } from "react-beautiful-dnd";
import { CSVLink } from "react-csv";
import Footer from "./Footer";
import { v4 as uuidv4 } from "uuid";

export class TaskHandler extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: {},
      dates: [],
      otherCats: [],
      datumVerschiebung: -1,
      othersVerschiebung: 0,
      CatList: [],
      rawData: [{}],
      columns: Math.floor((window.innerWidth - 65) / 360),
      api: process.env.REACT_APP_API || "localhost:5000",
    };

    this.isDragging = false;
    this.draggingObj = "";

    window.addEventListener("resize", () => {
      var columns = Math.floor((window.innerWidth - 65) / 360);
      if (columns !== this.state.columns) {
        this.setDates();
        this.getOtherCats();
        this.setState({ columns: columns });
      }
    });

    if (localStorage.getItem("token") === null) {
      this.props.setAuth(false);
    }

    this.setDates();
    this.getOtherCats();

    this.dateplusone = this.dateplusone.bind(this);
    this.moveDayBack = this.moveDayBack.bind(this);
    this.moveDayUp = this.moveDayUp.bind(this);

    this.addTask = this.addTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.toogleDone = this.toogleDone.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.getOtherCats = this.getOtherCats.bind(this);
    this.rightClick = this.rightClick.bind(this);
    this.leftClick = this.leftClick.bind(this);
    this.rightClickothers = this.rightClickothers.bind(this);
    this.leftClickothers = this.leftClickothers.bind(this);
    this.addOtherCat = this.addOtherCat.bind(this);
    this.deletekategorie = this.deletekategorie.bind(this);
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
    this.handleOnDragEndOthers = this.handleOnDragEndOthers.bind(this);
    this.changeCat = this.changeCat.bind(this);
    this.getCatList = this.getCatList.bind(this);
  }

  async updateDateShift(val) {
    // val is passed by the arrows and is either 1 or -1
    let temp = this.state.datumVerschiebung + val;
    this.state.datumVerschiebung = temp;
    this.setState({ datumVerschiebung: temp });
    this.setDates();
    this.getTasks();
  }

  async getOtherCats() {
    await this.getTasks();
    let tempq = await this.getCatList();
    try {
      tempq = tempq.split("/");
    } catch (error) {
      return;
    }
    let temp = [];
    for (
      let i = this.state.othersVerschiebung;
      i <
      this.state.othersVerschiebung +
        Math.floor((window.innerWidth - 65) / 360);
      i++
    ) {
      if (tempq[i] !== undefined && !temp.includes(tempq[i])) {
        temp.push(tempq[i]);
      }
    }
    this.state.otherCats = temp;
    this.setState({ otherCats: temp });
  }
  setDates() {
    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var result = [];
    var dV = this.state.datumVerschiebung;
    let counter = Math.floor((window.innerWidth - 65) / 360) + dV;
    if (counter < 0) {
      var d = new Date();
      d.setDate(d.getDate() + dV);
      let temp =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getDate() +
        "-" +
        weekDays[d.getDay()];
      result.push(temp);
      temp = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      console.log(result);
      this.state.dates = result;
      return;
    }
    for (var i = dV; i < counter; i++) {
      var d = new Date();
      d.setDate(d.getDate() + i);
      let temp =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getDate() +
        "-" +
        weekDays[d.getDay()];
      result.push(temp);
      temp = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    }
    console.log(result);
    this.state.dates = result;
  }

  async sortTasks(tasks) {
    let oTasks = {};
    try {
      tasks.forEach((task) => {
        let temp = task.kategorie;
        if (!oTasks[temp]) {
          oTasks[temp] = [task];
        } else {
          let name = task.kategorie;
          let temp = oTasks[name];
          if (task.inhalt !== "") {
            temp.push(task);
          }

          oTasks[name] = temp;
        }
      });
    } catch (e) {
      console.log(e);
    }
    this.state.tasks = oTasks;
    this.setState((tasks = oTasks));
  }

  async getTasks() {
    try {
      const response = await fetch(`https://${this.state.api}/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      const jsonData = await response.json();
      console.log(jsonData);
      this.state.rawData = jsonData;
      if (jsonData !== undefined) {
        await this.sortTasks(jsonData);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async returnTasks() {
    try {
      const response = await fetch(`https://${this.state.api}/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      const jsonData = await response.json();
      if (jsonData !== undefined) {
        return jsonData;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async addTask(obj, kategorie) {
    const task = obj;
    if (task.includes(";")) {
      return;
    }
    const done = "FALSE";
    let temp =
      kategorie.split("-")[0] +
      "-" +
      kategorie.split("-")[1] +
      "-" +
      kategorie.split("-")[2];

    if (temp.includes("undefined")) {
      temp = temp.split("-")[0];
    }

    kategorie = temp;
    const request = async () => {
      try {
        let inhalt = task;
        let id = uuidv4();
        const body = { kategorie, inhalt, done, id };
        await fetch(`https://${this.state.api}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(body),
        });
      } catch (err) {
        console.error(err);
      }
    };
    await request();
    await this.getTasks();
  }

  async removeTask(id) {
    try {
      await fetch(`https://${this.state.api}/tasks/${id["id"]}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      });
    } catch (err) {
      console.error(err);
    }
    await this.getTasks();
  }

  async changeCat(result) {
    let kat = result.destination.droppableId;
    let newkat =
      kat.split("-")[0] + "-" + kat.split("-")[1] + "-" + kat.split("-")[2];
    if (newkat.includes("undefined")) {
      newkat = newkat.split("-")[0];
    }
    let id = result.draggableId;
    try {
      let body = { newkat: newkat, id: id };
      await fetch(`https://${this.state.api}/kategorie/tasks`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log(error);
    }
    await this.getTasks();
  }

  async updateTask(obj, newInhalt) {
    try {
      if (newInhalt.includes(";")) {
        return;
      }
      newInhalt = newInhalt
        .replaceAll("<em>", "***")
        .replaceAll("<strong>", "**")
        .replaceAll("<u>", "&&");
      const body = { newInhalt };
      await fetch(`https://${this.state.api}/tasks/${obj["id"]}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error(err);
    }

    await this.getTasks();
  }

  async getCatList() {
    try {
      const response = await fetch(`https://${this.state.api}/tasks/cats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      try {
        if (response.status === 405) {
          console.log("Not authorized");
          this.props.setAuth(false);
        }
      } catch (error) {
        console.log(error);
      }

      try {
        const jsonData = await response.json();
        console.log(jsonData);
        let liste = jsonData[0]["liste"];
        return liste;
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCat(cat) {
    let liste = await this.getCatList();
    liste = liste.split("/");
    let temp = [];
    for (var i = 0; i < liste.length; i++) {
      if (liste[i] !== cat) {
        temp.push(liste[i]);
      }
    }
    try {
      let newListe = temp.join("/");
      const body = { newListe: newListe };

      await fetch(`https://${this.state.api}/tasks/cats/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async addCat(cat) {
    try {
      if (cat.includes(";")) {
        return;
      }
      let liste = await this.getCatList();
      let newListe;
      if (liste === undefined) {
        newListe = cat;
      } else {
        newListe = liste + "/" + cat;
      }

      console.log(newListe);
      const body = { newListe: newListe };
      await fetch(`https://${this.state.api}/tasks/cats/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async toogleDone(obj, cb_refreshState) {
    let done = obj.done;
    let param;
    done ? (param = "FALSE") : (param = "TRUE");
    const body = { param };
    try {
      await fetch(`https://${this.state.api}/tasks/state/${obj["id"]}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error);
    }
    cb_refreshState();
  }

  async deletekategorie(kategorie) {
    try {
      const body = { kategorie };
      await this.deleteCat(kategorie);
      await fetch(`https://${this.state.api}/all/tasks`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(body),
      });
      await this.getOtherCats();
    } catch (error) {
      console.error(error);
    }
  }

  leftClick() {
    this.updateDateShift(-1);
  }
  rightClick() {
    this.updateDateShift(1);
  }
  async updateDateShiftothers(val) {
    //if (val === 1 && this.state.otherCats.length < 5) return;
    if (val === -1 && this.state.othersVerschiebung === 0) return;
    this.state.othersVerschiebung = this.state.othersVerschiebung + val;
    this.getOtherCats();
  }
  leftClickothers() {
    this.updateDateShiftothers(-1);
  }
  rightClickothers() {
    this.updateDateShiftothers(1);
  }

  async addOtherCat(kategorie) {
    await this.addCat(kategorie);
    await this.getOtherCats();
  }

  handleOnDragEnd(result) {
    console.log(result.destination);
    if (!result.destination) return;

    if (result.destination.droppableId === result.source.droppableId) {
      return;
    } else {
      this.changeCat(result);
    }
  }

  async handleOnDragEndOthers(result) {
    if (!result.destination) return;
    if (result.destination.droppableId === result.source.droppableId) {
      return;
    } else {
      await this.changeCat(result);
    }
    await this.getOtherCats();
  }
  async updateCat(kategorie, id) {
    try {
      let body = { newkat: kategorie, id: id };
      await fetch(`https://${this.state.api}/kategorie/tasks`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log(error);
    }
    await this.getTasks();
  }
  moveDayBack(obj) {
    this.updateCat(this.dateminusone(obj["kategorie"]), obj["id"]);
  }
  moveDayUp(obj) {
    this.updateCat(this.dateplusone(obj["kategorie"]), obj["id"]);
  }

  // function that generates a date 1 day after input date format: yyyy-mm-dd
  dateplusone(date) {
    let d = new Date(date);
    d.setDate(d.getDate() + 1);
    let dd = d.getDate();
    let mm = d.getMonth() + 1;
    let y = d.getFullYear();
    return y + "-" + mm + "-" + dd;
  }

  // same function as above but with -1 day
  dateminusone(date) {
    let d = new Date(date);
    d.setDate(d.getDate() - 1);
    let dd = d.getDate();
    let mm = d.getMonth() + 1;
    let y = d.getFullYear();
    return y + "-" + mm + "-" + dd;
  }

  render() {
    let csvReport;
    let temp = this.state.tasks;
    const data = JSON.parse(JSON.stringify(this.state.rawData));
    if (!data.includes("error")) {
      for (let i in data) {
        data[i].done ? (data[i].done = "true") : (data[i].done = "false");
        data[i].id = `${data[i].id}`;
      }
      const headers = [
        { label: "ID", key: "id" },
        { label: "Kategorie", key: "kategorie" },
        { label: "Inhalt", key: "inhalt" },
        { label: "Erledigt", key: "done" },
      ];
      csvReport = {
        filename: "tasks.csv",
        headers: headers,
        data: data,
      };
    } else {
      csvReport = {
        filename: "tasks.csv",
        headers: [],
        data: [],
      };
    }

    return (
      <>
        <div onMouseMove={this.handleMouseMove}>
          <DragDropContext
            onDragEnd={this.handleOnDragEnd}
            onDragStart={(e) => {
              this.isDragging = true;
              this.draggingObj = e;
            }}
          >
            <div
              className="main-task-container"
              style={{ padding: 0, margin: 0 }}
            >
              <div className="date-row-main-div">
                <div onClick={this.leftClick} className="arrow-icon-container">
                  <MdKeyboardArrowLeft className="arrow-icons" />
                </div>

                <div id="rows2" className="innerContainer">
                  {this.state.dates.map((date) => (
                    <TaskClumnDays
                      key={date}
                      title={date}
                      removeTask={this.removeTask}
                      addTask={this.addTask}
                      updateTask={this.updateTask}
                      toggleDone={this.toogleDone}
                      reorderTasks={this.reorderTasks}
                      moveDayBack={this.moveDayBack}
                      moveDayUp={this.moveDayUp}
                      object={
                        temp[
                          date.split("-")[0] +
                            "-" +
                            date.split("-")[1] +
                            "-" +
                            date.split("-")[2]
                        ]
                      }
                    />
                  ))}
                </div>

                <div onClick={this.rightClick} className="arrow-icon-container">
                  <MdKeyboardArrowRight className="arrow-icons" />
                </div>
              </div>

              <div className="middel-task-toolbar">
                <div className="toolbar-div">
                  <AddCatModal
                    obj={{ id: 10, inhalt: "" }}
                    addCat={this.addOtherCat}
                  />
                  <div>
                    <CSVLink {...csvReport}> Export </CSVLink>

                    <button
                      className="task-logout-button"
                      onClick={() => {
                        localStorage.removeItem("token");
                        window.location.reload();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              <div className="date-row-main-div">
                <div
                  onClick={this.leftClickothers}
                  className="arrow-icon-container"
                >
                  <MdKeyboardArrowLeft className="arrow-icons" />
                </div>
                <div className="innerContainer" id="rows1">
                  {this.state.otherCats.map((cat) => (
                    <TaskColumnOthers
                      key={cat}
                      deletekategorie={this.deletekategorie}
                      title={cat}
                      removeTask={this.removeTask}
                      addTask={this.addTask}
                      updateTask={this.updateTask}
                      toggleDone={this.toogleDone}
                      reorderTasks={this.reorderTasks}
                      object={temp[cat]}
                    />
                  ))}
                </div>
                <div
                  onClick={this.rightClickothers}
                  className="arrow-icon-container"
                >
                  <MdKeyboardArrowRight className="arrow-icons" />
                </div>
              </div>
            </div>
          </DragDropContext>
        </div>
        <div className="third-seperator-tasks" />
        <div className="footer-tasks">
          <Footer />
        </div>
      </>
    );
  }
}

export default TaskHandler;
