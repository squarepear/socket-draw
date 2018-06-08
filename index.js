var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var path = require('path')

var playerCount = 0
var Art = []

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/views/index.html'))
})

io.on('connection', function (socket) {
  console.log('a user connected')
  playerCount++
  console.log(`${playerCount} users online now`)

  socket.emit('requestArt')

  socket.on('draw', (info) => {
    io.emit('draw', info)
    Art.push(info)
  })

  socket.on('requestArt', (art) => {
    socket.emit('art', Art)
  })

  socket.on('disconnect', function () {
    console.log('user disconnected')
    playerCount--
    if (playerCount <= 0) {
      playerCount = 0
      setTimeout(() => {
        if (playerCount === 0) {
          Art = []
        }
      }, 5000)
    }
  })
})

http.listen(process.env.port || 80, function () {
  console.log(`listening on *:${process.env.port || 80}`)
})
