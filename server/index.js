const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const cron = require("node-cron");
const bcrypt = require("bcrypt");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration
app.use(helmet());
app.use(express.json());

// Middelware

const checkAuth = async (req, res, next) => {
  console.log(req.headers);
  const token = req.header("x-auth-token");

  // CHECK IF WE EVEN HAVE A TOKEN
  if (!token) {
    return res.status(405).send("Invalid token");
  }

  try {
    const user = await jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    req.email = user.email;
    next();
  } catch (error) {
    res.status(405).send("Invalid token");
  }
};

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(403).send("Please enter all fields");
  }
  try {
    await pool.query(
      `SELECT * FROM users WHERE email = '${email}'`,
      async function (error, user, fields) {
        if (error) console.log(error);
        else {
          console.log(user);
          if (user.length > 0) {
            return res.status(403).send("User already exists");
          }
          // Hash the password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          // Insert the user into the database
          await pool.query(
            `INSERT INTO users (email, password) VALUES ('${email}', '${hashedPassword}')`
          );

          // Create a token
          const token = jwt.sign({ email }, process.env.ACCESS_SECRET_KEY, {
            expiresIn: "72h",
          });

          // putting an example categories with the user email in the database
          await pool.query(
            `INSERT INTO categories (email, liste) VALUES ('${email}', 'example')`
          );

          // Send the token to the user
          return res.json({ token });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//function that logs user in
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(403).send("Please enter all fields");
  }
  try {
    await pool.query(
      `SELECT * FROM users WHERE email = '${email}'`,
      async function (error, user, fields) {
        if (error) {
          console.log(error);
          // send error to user
          return res.status(403).send("error");
        } else {
          if (!user) {
            return res.status(403).send("User does not exist");
          }

          // Check if the password is correct
          const validPassword = await bcrypt.compare(
            password,
            user[0].password
          );
          if (!validPassword) {
            return res.status(403).send("Invalid password");
          }

          // Create a token
          const token = jwt.sign({ email }, process.env.ACCESS_SECRET_KEY, {
            expiresIn: "72h",
          });

          // Send the token to the user
          return res.json({ token });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// get all tasks

app.get("/tasks", checkAuth, async (req, res) => {
  try {
    console.log(req.email);
    await pool.query(
      `SELECT kategorie, inhalt, done, id FROM tasks where email = '${req.email}'`,
      function (error, results, fields) {
        if (error) console.log(error);
        else {
          console.log(results);
          return res.json(results);
        }
      }
    );
  } catch (err) {
    res.json("error occured");
    console.log(`${err.message} when fetching tasks ${new Date()}`);
  }
});

// add a task

app.post("/tasks", checkAuth, async (req, res) => {
  try {
    let { kategorie, inhalt, done, id } = req.body;
    done === "FALSE" ? (done = 0) : (done = 1);
    await pool.query(
      `INSERT INTO tasks (kategorie, inhalt, done, id, email) VALUES('${kategorie}','${inhalt}','${done}', '${id}', '${req.email}')`
    );

    return res.json("added task");
  } catch (err) {
    return res.json("error occured");
  }
});

// delete a task

app.delete("/tasks/:id", checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM tasks WHERE id = '${id}'`);

    return res.json("task was deleted");
  } catch (err) {
    console.log(err.message);
    return res.json("error occured");
  }
});

//update a task

app.put("/tasks/:id", checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { newInhalt } = req.body;

    await pool.query(
      `UPDATE tasks SET inhalt = '${newInhalt}' WHERE id = '${id}'`
    );

    return res.json("updated task");
  } catch (err) {
    console.log(err.message);
    return res.json("error occured");
  }
});

//update a kategorie

app.put("/kategorie/tasks", checkAuth, async (req, res) => {
  try {
    const { id, newkat } = req.body;
    console.log(id, newkat);
    await pool.query(
      `UPDATE tasks SET kategorie = '${newkat}' WHERE id = '${id}'`
    );

    return res.json("updated task");
  } catch (err) {
    console.log(err.message);
    return res.json("error occured");
  }
});

//update a tasks state(done or not)

app.put("/tasks/state/:id", checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    let { param } = req.body;
    param === "FALSE" ? (param = 0) : (param = 1);
    await pool.query(`UPDATE tasks SET done = ${param} WHERE id = '${id}'`);

    return res.json("updated task");
  } catch (err) {
    console.log(err.message);
    return res.json("error occured");
  }
});

// deleting all tasks of a kategorie (deleting the kategorie)

app.delete("/all/tasks", checkAuth, async (req, res) => {
  try {
    const { kategorie } = req.body;
    await pool.query(
      `delete from tasks where kategorie = ${kategorie} and email = '${req.email}'`
    );
    return res.json("deleted kategorie");
  } catch (err) {
    console.log(err.message);
    return res.json("error occured");
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

app.get("/tasks/cats", checkAuth, async (req, res) => {
  try {
    await pool.query(
      "SELECT * FROM categories where email = '" + req.email + "'",
      function (error, results, fields) {
        if (error) console.log(error);
        else {
          console.log(results);
          return res.json(results);
        }
      }
    );
  } catch (err) {
    console.log(err.message);
    return res.json("error occured");
  }
});

// add a Cat

app.post("/tasks/cats/add", checkAuth, async (req, res) => {
  try {
    const { newListe } = req.body;
    const f = await pool.query(
      `update categories set liste = '${newListe}' where email = '${req.email}'`
    );
    console.log(f);
    return res.json("added Task");
  } catch (err) {
    console.log(err.message);
    return res.json("error occured");
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
//const host = "192.168.178.41";

app.listen(port || process.env.PORT, () => {
  console.log("server started");
});
