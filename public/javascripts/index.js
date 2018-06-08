var id = 0
if (window.localStorage.getItem('id')) {
  id = window.localStorage.getItem('id')
} else {
  id = guid()
  window.localStorage.setItem('id', id)
}

var socket = io()

var pmouse = {
  x: null,
  y: null
}

var lineColor = {
  r: 0,
  g: 0,
  b: 0
}

if (window.localStorage.getItem('color')) {
  lineColor = window.localStorage.getItem('color')
} else {
  window.localStorage.setItem('color', lineColor)
}

var Art = []

function setup() {
  createCanvas(windowWidth, windowHeight).parent('draw')

  strokeWeight(5)
}

function draw() {
  background(225)

  if (mouseIsPressed) {
    let info = {
      pmouse: (pmouse.x) ? {
        x: pmouse.x * 1,
        y: pmouse.y * 1
      } : {
        x: mouseX - (windowWidth/2),
        y: mouseY - (windowHeight/2)
      },
      mouse: {
        x: mouseX - (windowWidth/2),
        y: mouseY - (windowHeight/2)
      },
      color: lineColor,
      userID: id
    }

    socket.emit('draw', info)

    Art.push(info)

    pmouse.x = mouseX - (windowWidth/2)
    pmouse.y = mouseY - (windowHeight/2)
  } else {
    pmouse.x = null
    pmouse.y = null
  }

  drawLines()

  noStroke()
  fill(lineColor.r, lineColor.g, lineColor.b)
  rect(0, 0, windowWidth, 20)
}

socket.on('draw', (info) => {
  if (info.userID !== id) {
    Art.push(info)
  }
})

socket.on('art', (infoList) => {
  Art = infoList
})

socket.on('requestArt', () => {
  socket.emit('requestArt', Art)
})

function drawLines() {
  Art.forEach((info) => {
    stroke(info.color.r, info.color.g, info.color.b)

    line(info.pmouse.x + (windowWidth/2), info.pmouse.y + (windowHeight/2), info.mouse.x + (windowWidth/2), info.mouse.y + (windowHeight/2))
  })
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}

$(document).ready(() => {
  $('#redButton').on('click', () => {
    changeColor(255, 0, 0)
  })
  $('#greenButton').on('click', () => {
    changeColor(0, 255, 0)
  })
  $('#blueButton').on('click', () => {
    changeColor(0, 0, 255)
  })
  $('#blackButton').on('click', () => {
    changeColor(0, 0, 0)
  })
})

function changeColor(r, g, b) {
  lineColor.r = r
  lineColor.g = g
  lineColor.b = b
  window.localStorage.setItem('color', lineColor)
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}
