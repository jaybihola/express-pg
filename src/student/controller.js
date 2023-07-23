const { pool } = require("../../db")
const queries = require("./queries")

const getStudents = (req, res) => {
  pool.query(queries.getStudents, (err, results) => {
    if (err) throw err;
    res.status(200).json(results.rows);
  })
}

const addStudent = (req, res) => {
  const {name, email, age, dob} = req.body;

  pool.query(queries.getStudentByEmail, [email], (err, results) => {
    if (results.rows.length) res.send("Email already exists")

    pool.query(queries.addStudent, [name, email, age, dob], (err, results) => {
      if (err) throw err;

      res.status(201).send("Student create successfully!");
    })

  })

}

const getStudentById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getStudentById, [id], (err, results) => {
    if (err) throw err;
    res.status(200).json(results.rows);
  })
}

const updateStudentById = (req, res) => {
  const id = parseInt(req.params.id);
  const name = req.body.name;

  new Promise((resolve, reject) => {
    pool.query(queries.getStudentById, [id], (err, results) => {
    if (err) reject("error");
    else resolve(results);
  })}).then((results) => {
    if (!results.rows.length) return res.send("Student not found");

    pool.query(queries.updateStudentById, [name, id], (err, results) => {
      if (err) throw err;
      return res.status(200).send("updated")
    })

  }).catch((err) => console.log(err));
}

const deleteStudentById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getStudentById, [id], (err, results) => {
    if (!results.rows.length) {
      return res.send("Student does not exist");
    }

    pool.query(queries.deleteStudentById, [id], (err, results) => {
      if (err) throw err;
      res.status(200).send("Student removed");
    })
  })
}

module.exports = {
  getStudents,
  getStudentById,
  updateStudentById,
  deleteStudentById,
  addStudent
}

