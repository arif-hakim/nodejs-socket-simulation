const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')

app.use(cors())
require('dotenv').config()
app.get('/create-instance', async (req, res) => {
  let payload = {
    status: "create_success",
    from: 'middleware',
  }
  console.log("=== HIT BY GATEWAY")
  await axios.post('http://localhost:8000/create-instance-callback', payload)
  console.log("=== SEND TO GATEWAY", payload)
  res.send({
    status: "OK"
  })
})

const port = process.env.PORT
app.listen(port, () => {
  console.log('middleware running at port : ' + port)
})