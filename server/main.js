const express = require('express')
const { createServer } = require('http')
const app = express()
const cors = require('cors')
const { WebSocketServer, WebSocket } = require('ws')
const axios = require('axios')
require('dotenv').config()

const MIDDLEWARE_URL = process.env.MIDDLEWARE_URL
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT

app.use(cors())
app.use(express.json())

// WEBSOCKET INSTANCE
const wss = new WebSocketServer({ port: WEBSOCKET_PORT, path: '/websocket' })
wss.on('connection', function connection(ws) {
  let msg = 'WebSocket Connected!'
  ws.on('message', () => {

  })
  console.log('=== WEBSOCKET SERVER : %s', msg);
  ws.send(msg);
});

// ROUTES
app.get('/get', async (req, res) => {
  let url = `${MIDDLEWARE_URL}/create-instance`
  console.log("URL : ", url)
  await axios.get(url)
  return res.send({
    status: 'OK'
  })
})

app.post('/create-instance-callback', (req, res) => {
  let msg = req.body
  console.log("=== HIT BY MIDDLEWARE, DATA FROM MIDDLEWARE : ", msg)
  wss.clients.forEach(client => {
    console.log("=== SEND TO WEBSOCKET : %s", msg)
    client.send(JSON.stringify(msg))
  })
  return res.send({
    status: 'OK',
    msg
  })
})

const port = process.env.PORT
app.listen(port, () => {
  console.log('gateway running at port : ' + port)
  console.log('websocket running at port : ' + WEBSOCKET_PORT)
})