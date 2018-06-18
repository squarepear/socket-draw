const {PORT = 3000} = process.env
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

var playerCount = 0
var Art = []

app.use(express.static('public'))
app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', function (req, res) {
  res.render('index')
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
    let tArt = Art

    art.forEach((line) => {
      let duplicate = false
      line.userID = 0

      Art.forEach((tline) => {
        tline.userID = 0

        if (line === tline) {
          duplicate = true
        }
      })

      if (!duplicate) {
        tArt.push(line)
      }
    })

    Art = tArt

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

http.listen(PORT, function () {
  console.log(`listening on *:${PORT}`)
})
