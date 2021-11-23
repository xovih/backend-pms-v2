require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")

const PORT = process.env.APP_PORT || 4503
const raspiRoutes = require("./routes/raspi")

app.use(cors())
app.use(express.json())

// Routes
app.use("/api/dashboard", raspiRoutes)


app.listen(PORT, (err) => {
  if (err) {
    return console.log(err)
  }

  console.log(`Backen Server Running at port ${PORT}`)
})