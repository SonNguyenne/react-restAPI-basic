const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'school',
  password: 'postgres',
  port: 5432,
})

const getUsers = (req, res) => {
  pool.query('SELECT * FROM student', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const getUserById = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query(`SELECT * FROM student WHERE studentId = ${id}`, (error, results) => {
    if (error) {
      throw error
    }   
    res.status(200).json(results.rows)
  })
}

const createUser = (req, res) => {
  const { studentid, studentname, studentphone, studentclassid } = req.body

  pool.query(`INSERT INTO student(studentId, studentName ,studentPhone, studentClassId) VALUES ('${studentid}', '${studentname}','${studentphone}', '${studentclassid}')`, (error, results) => {
    if (error) {    
      throw error
    }
    res.status(201).send({
      message: "Show list sucessfully",
      body: {
         student:{studentid, studentname,studentphone, studentclassid}
      }
    });
  })
}

const updateUser = (req, res) => {
  const id = parseInt(req.params.id)
  const { studentname, studentphone, studentclassid } = req.body


  pool.query(
    `UPDATE student SET studentName ='${studentname}',studentPhone ='${studentphone}' , studentClassId = '${studentclassid}' WHERE studentId = ${id}`,
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send({
        message: "Updated",
        body: {
           student:{studentname,studentphone, studentclassid}
        }
      });
    }
  )
}

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query(`DELETE FROM student WHERE studentId = ${id}`, (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}