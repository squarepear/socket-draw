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

var Art = []

function setup() {
  createCanvas(windowWidth, windowHeight).parent('draw')

  strokeWeight(5)
}

function draw() {
  background(225)

  if (mouseIsPressed) {
    socket.emit('draw', {
      pmouse: (pmouse.x) ? (pmouse) : {
        x: mouseX - (windowWidth/2),
        y: mouseY - (windowHeight/2)
      },
      mouse: {
        x: mouseX - (windowWidth/2),
        y: mouseY - (windowHeight/2)
      },
      color: lineColor
    })

    pmouse.x = mouseX - (windowWidth/2)
    pmouse.y = mouseY - (windowHeight/2)
  } else {
    pmouse.x = null
    pmouse.y = null
  }

  Art.forEach((info) => {
    stroke(info.color.r, info.color.g, info.color.b)

    line(info.pmouse.x + (windowWidth/2), info.pmouse.y + (windowHeight/2), info.mouse.x + (windowWidth/2), info.mouse.y + (windowHeight/2))
  })

  noStroke()
  fill(lineColor.r, lineColor.g, lineColor.b)
  rect(0, 0, windowWidth, 20)
}

socket.on('draw', (info) => {
  Art.push(info)
})

socket.on('art', (infoList) => {
  Art = infoList
})

socket.on('requestArt', () => {
  socket.emit('requestArt', Art)
})

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
}
