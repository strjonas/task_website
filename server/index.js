const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const cron = require("node-cron");
const bcrypt = require("bcrypt");
const helmet = require("helmet");

app.use(helmet());
app.use(cors());
app.use(express.json());

// get all tasks

app.get("/tasks", async (req, res) => {
  try {
    // const alltasks = await pool.query("SELECT * FROM tasks");
    // let liste = [];
    // for (let i = 0; i < alltasks.length; i++) {
    //   liste.push(alltasks[i]);
    // }
    // res.json(liste);
    await pool.query("SELECT * FROM tasks", function (error, results, fields) {
      if (error) console.log(error);
      else {
        console.log(results);
        res.json(results);
      }
    });
  } catch (err) {
    res.json("error occured");
    console.log(`${err.message} when fetching tasks ${new Date()}`);
  }
});

// add a task

app.post("/tasks", async (req, res) => {
  try {
    let { kategorie, inhalt, done, id } = req.body;
    done === "FALSE" ? (done = 0) : (done = 1);
    await pool.query(
      `INSERT INTO tasks (kategorie, inhalt, done, id) VALUES('${kategorie}','${inhalt}','${done}', '${id}')`
    );

    res.json("added task");
  } catch (err) {
    res.json("error occured");
    console.log(err.message);
  }
});

// delete a task

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM tasks WHERE id = '${id}'`);

    res.json("task was deleted");
  } catch (err) {
    res.json("error occured");
    console.log(err.message);
  }
});

//update a task

app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { newInhalt } = req.body;

    await pool.query(
      `UPDATE tasks SET inhalt = '${newInhalt}' WHERE id = '${id}'`
    );

    res.json("updated task");
  } catch (err) {
    console.log(err.message);
    res.json("error occured");
  }
});

//update a kategorie

app.put("/kategorie/tasks", async (req, res) => {
  try {
    const { id, newkat } = req.body;
    console.log(id, newkat);
    await pool.query(
      `UPDATE tasks SET kategorie = '${newkat}' WHERE id = '${id}'`
    );

    res.json("updated task");
  } catch (err) {
    res.json("error occured");
    console.log(err.message);
  }
});

//update a tasks state(done or not)

app.put("/tasks/state/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let { param } = req.body;
    param === "FALSE" ? (param = 0) : (param = 1);
    await pool.query(`UPDATE tasks SET done = ${param} WHERE id = '${id}'`);

    res.json("updated task");
  } catch (err) {
    res.json("error occured");
    console.log(err.message);
  }
});

// deleting all tasks of a kategorie (deleting the kategorie)

app.delete("/all/tasks", async (req, res) => {
  try {
    const { kategorie } = req.body;
    await pool.query(`delete from tasks where kategorie = ${kategorie}`);
    res.json("deleted kategorie");
  } catch (err) {
    res.json("error occured");
    console.log(err.message);
  }
});

// updating every days tasks at midnight to the next day

async function updateDates() {
  var d = new Date();
  d.setDate(d.getDate());
  let temp = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

  d.setDate(d.getDate() + 1);
  let newTemp = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  try {
    await pool.query(
      `UPDATE tasks SET date = '${newTemp}' WHERE date = '${temp}'`
    );
  } catch (err) {
    console.log(err.message);
  }
}

// get Catlist

app.get("/tasks/cats", async (req, res) => {
  try {
    await pool.query(
      "SELECT * FROM categories",
      function (error, results, fields) {
        if (error) console.log(error);
        else {
          console.log(results);
          res.json(results);
        }
      }
    );
  } catch (err) {
    console.log(err.message);
    res.json("error occured");
  }
});

// add a Cat

app.post("/tasks/cats/add", async (req, res) => {
  try {
    const { newListe } = req.body;
    const f = await pool.query(`update categories set liste = '${newListe}'`);
    console.log(f);
    res.json("added Task");
  } catch (err) {
    res.json("error occured");
    console.log(err.message);
  }
});

// cron jobs
cron.schedule("59 23 * * *", function () {
  try {
    updateDates();
  } catch (error) {
    console.log(error.message);
  }

  console.log("updated Dates");
});

const port = 5000;

app.listen(port, () => {
  console.log("server started");
});
