// server.js

const express = require("express")
const mysql = require("mysql")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()

// enable cors
const corsOptions = {
  origin: "*", // Specify allowed origin(s)
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}

app.use(cors(corsOptions))

// Configure MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})

db.connect((err) => {
  if (err) throw err
  console.log("Connected to MySQL database")
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/getall", (req, res) => {
  const sql = "SELECT * FROM feedbacks"
  db.query(sql, (err, result) => {
    if (err) throw err
    res.json({ items: result })
  })
})

// Create a new item
app.post("/feedback", (req, res) => {
  const { feedbackId, feedback, rating } = req.body
  const sql =
    "INSERT INTO feedbacks (feedbackId, feedback, rating) VALUES (?, ?, ?)"
  db.query(sql, [feedbackId, feedback, rating], (err, result) => {
    if (err) throw err
    res.status(201).json({ msg: "Berhasil post feedback" })
  })
})

const port = process.env.PORT || 9002
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
