const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const cron = require("node-cron");

//middleware//
app.use(cors());
app.use(express.json());

//ROUTES//

//create bin

app.post("/bins", async (req, res) => {
  try {
    const { description } = req.body;
    const newBin = await pool.query(
      "INSERT INTO pastebin (description) VALUES($1) RETURNING *",
      [description]
    );

    res.json(newBin.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

//get all bins

app.get("/bins", async (req, res) => {
  try {
    const allBins = await pool.query("SELECT * FROM pastebin");
    res.json(allBins.rows);
  } catch (err) {
    console.error(err);
  }
});

// get a bin

app.get("/bins/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const bin = await pool.query("SELECT * FROM pastebin WHERE id = $1", [id]);

    res.json(bin.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

//delete a bin

app.delete("/bins/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBin = await pool.query("DELETE FROM pastebin WHERE id = $1", [
      id,
    ]);

    res.json("bin was deleted");
  } catch (err) {
    console.error(err);
  }
});

//update a bin

app.put("/bins/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const updateBin = await pool.query(
      "UPDATE pastebin SET description = $1 WHERE id = $2",
      [description, id]
    );

    res.json("updated bin");
  } catch (err) {
    console.error(err.message);
  }
});

//create paths
// same just for notes //
//create note

app.post("/notes", async (req, res) => {
  try {
    const { description } = req.body;
    const newnote = await pool.query(
      "INSERT INTO note (description) VALUES($1) RETURNING *",
      [description]
    );

    res.json(newnote.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

//get all notes

app.get("/notes", async (req, res) => {
  try {
    const allnotes = await pool.query("SELECT * FROM note");
    res.json(allnotes.rows);
  } catch (err) {
    console.error(err);
  }
});

// get a note

app.get("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await pool.query("SELECT * FROM note WHERE id = $1", [id]);

    res.json(note.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

//delete a note

app.delete("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletenote = await pool.query("DELETE FROM note WHERE id = $1", [id]);

    res.json("note was deleted");
  } catch (err) {
    console.error(err);
  }
});

//update a note

app.put("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const updatenote = await pool.query(
      "UPDATE note SET description = $1 WHERE id = $2",
      [description, id]
    );

    res.json("updated note");
  } catch (err) {
    console.error(err.message);
  }
});

// get all tasks

app.get("/tasks", async (req, res) => {
  try {
    const alltasks = await pool.query("SELECT * FROM tasks");
    res.json(alltasks.rows);
  } catch (err) {
    console.error(err);
  }
});

// add a task

app.post("/tasks", async (req, res) => {
  try {
    const { kategorie, inhalt, gmacht } = req.body;
    const newTask = await pool.query(
      "INSERT INTO tasks (kategorie, inhalt, gmacht) VALUES($1,$2,$3) RETURNING *",
      [kategorie, inhalt, gmacht]
    );

    res.json(newTask.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

// delete a task

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);

    res.json("task was deleted");
  } catch (err) {
    console.error(err);
  }
});

//update a task

app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { newInhalt } = req.body;

    const updatenote = await pool.query(
      "UPDATE tasks SET inhalt = $1 WHERE id = $2",
      [newInhalt, id]
    );

    res.json("updated task");
  } catch (err) {
    console.error(err.message);
  }
});

//update a kategorie

app.put("/kategorie/tasks", async (req, res) => {
  try {
    const { id, newkat } = req.body;

    const updatenote = await pool.query(
      "UPDATE tasks SET kategorie = $1 WHERE id = $2",
      [newkat, id]
    );

    res.json("updated task");
  } catch (err) {
    console.error(err.message);
  }
});

//update a tasks state(done or not)

app.put("/tasks/state/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { param } = req.body;
    const updatenote = await pool.query(
      "UPDATE tasks SET gmacht = $1 WHERE id = $2",
      [param, id]
    );

    res.json("updated task");
  } catch (err) {
    console.error(err.message);
  }
});

//switch two task rows

app.put("/switch/tasks", async (req, res) => {
  try {
    const { os, od } = req.body;

    await pool.query(
      "UPDATE tasks SET (gmacht,inhalt,kategorie) = ($1,$2,$3) WHERE id = $4",
      [os.gmacht, os.inhalt, os.kategorie, od.id]
    );
    await pool.query(
      "UPDATE tasks SET (gmacht,inhalt,kategorie) = ($1,$2,$3) WHERE id = $4",
      [od.gmacht, od.inhalt, od.kategorie, os.id]
    );
    res.json("switched task");
  } catch (err) {
    console.log(err);
  }
});

// deleting all tasks of a kategorie (deleting the kategorie)

app.delete("/all/tasks", async (req, res) => {
  try {
    const { kategorie } = req.body;
    await pool.query("delete from tasks where kategorie = $1", [kategorie]);
    console.log(`successfully deleted ${kategorie}`);
    res.json("deleted kategorie");
  } catch (err) {
    console.log(err);
  }
});

// updating every days tasks at midnight to the next day

async function updateDates() {
  var d = new Date();
  d.setDate(d.getDate());
  let temp = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

  d.setDate(d.getDate() + 1);
  let newTemp = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

  await pool.query("UPDATE tasks SET kategorie = $2 WHERE kategorie = $1", [
    temp,
    newTemp,
  ]);
}

// deleting everything with empty inhalt in tasks

async function deleteEmptys() {
  await pool.query("delete from tasks WHERE (inhalt is null or inhalt = '')");
  await pool.query(
    "delete from bookmarks WHERE (folder is null or folder = '')"
  );
  await pool.query("delete from bookmarks WHERE (link is null or link = '')");
  console.log("successfully deleted emptys");
}

// get Catlist

app.get("/tasks/cats", async (req, res) => {
  try {
    const cats = await pool.query("SELECT * FROM categories");
    res.json(cats.rows);
  } catch (err) {
    console.error(err);
  }
});

async function deleteUndefined() {
  try {
    await pool.query("delete from tasks where (id =76)");
  } catch (error) {
    console.log(error);
  }
}

// add a Cat

app.post("/tasks/cats/add", async (req, res) => {
  try {
    const { newListe } = req.body;
    console.log(newListe);
    await pool.query("update categories set liste = $1", [newListe]);

    res.json("added TAsk");
  } catch (err) {
    console.error(err);
  }
});

// Bookmarks

//get all bookmarks

app.get("/bookmarks", async (req, res) => {
  try {
    const data = await pool.query("select * from bookmarks");

    res.json(data.rows);
  } catch (error) {
    console.log(error);
  }
});

// add a bookmark/folder

app.post("/bookmarks/add", async (req, res) => {
  try {
    const { link, folder, isfolder } = req.body;
    await pool.query(
      "insert into bookmarks (link,folder,isfolder) values($1,$2,$3)",
      [link, folder, isfolder]
    );
    res.json("added bookmark");
  } catch (error) {
    console.log(error);
  }
});

// delete a bookmark

app.delete("/bookmarks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM bookmarks WHERE id = $1", [id]);

    res.json("bookmark was deleted");
  } catch (err) {
    console.error(err);
  }
});

// delete a bookmark-folder

app.delete("/delete/bookmarks", async (req, res) => {
  try {
    const { name, id } = req.body;
    await pool.query("DELETE FROM bookmarks WHERE folder = $1", [name]);
    await pool.query("delete from bookmarks where id = $1", [id]);

    res.json("bookmark-folder was deleted");
  } catch (err) {
    console.error(err);
  }
});

// add a picture

app.post("/pictures", async (req, res) => {
  try {
    const { url } = req.body;
    await pool.query("insert into pictures (url) values($1)", [url]);
    res.json("added picture");
  } catch (error) {
    console.log(error.message);
  }
});

// delete a picture

app.delete("/pictures", async (req, res) => {
  try {
    const { id } = req.body;
    await pool.query("delete from pictures where id = $1", [id]);
    res.json("deleted picture ");
  } catch (error) {
    console.log(error.message);
  }
});

// get all pictures

app.get("/pictures", async (req, res) => {
  try {
    const data = await pool.query("select * from pictures");
    res.json(data.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// cron jobs
cron.schedule("59 23 * * *", function () {
  try {
    updateDates();
    deleteEmptys();
  } catch (error) {
    console.log(error);
  }

  console.log("updated Dates");
});

app.listen(5000, () => {
  console.log("server started");
});
