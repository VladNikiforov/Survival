const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

const tileSize = 50

//WORLD GENERATION
let row = Math.round(canvas.width / tileSize) * 5
let column = Math.round(canvas.height / tileSize) * 5

let terrain = []
const simplex = new SimplexNoise()
function generateWorld() {
  const noiseScale = 0.03
  for (let x = 0; x < row; x++) {
    let terrainRow = []

    for (let y = 0; y < column; y++) {
      let noiseValue = simplex.noise2D(x * noiseScale, y * noiseScale)
      noiseValue = ((noiseValue + 1) / 2) * 100

      if (noiseValue <= 40) {
        ctx.fillStyle = '#239ac9' //Water
      } else if (noiseValue <= 70) {
        ctx.fillStyle = '#228b22' //Grass
      } else if (noiseValue <= 90) {
        ctx.fillStyle = '#767c7e' //Stone
      } else {
        ctx.fillStyle = '#fff' //Snow
      }
      terrainRow.push(ctx.fillStyle)

      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
    }
    terrain.push(terrainRow)
  }
}
generateWorld()

function loadWorld(offsetX, offsetY) {
  for (let x = 0; x <= row; x++) {
    for (let y = 0; y <= column; y++) {
      try {
        ctx.fillStyle = terrain[x][y]
      } catch {
        ctx.fillStyle = '#239ac9'
      }

      ctx.fillRect(x * tileSize + offsetX, y * tileSize + offsetY, tileSize, tileSize)
    }
  }
}
loadWorld()

function test() {
  terrain.forEach((x) => {
    x.forEach((y, i) => {
      if (y == '#228b22') {
        console.log('grass!')
        if (x[i + 1] == '#239ac9') {
          console.log('grass next to water')
        } else {
          console.log('bruh')
        }
      } else {
        console.log('not grass')
      }
    })
  })
}
test()

//PLAYER & PLAYER MOVEMENT
function playerMovement() {
  let xPos = 0
  let yPos = 0

  ctx.fillStyle = 'blue'
  ctx.fillRect(
    Math.round((canvas.width - tileSize) / 2 / tileSize) * tileSize,
    Math.round((canvas.height - tileSize) / 2 / tileSize) * tileSize,
    tileSize,
    tileSize
  )

  document.addEventListener('keydown', (event) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    switch (event.code) {
      case 'KeyW':
        loadWorld(xPos, (yPos += 10))
        break
      case 'KeyA':
        loadWorld((xPos += 10), yPos)
        break
      case 'KeyS':
        loadWorld(xPos, (yPos -= 10))
        break
      case 'KeyD':
        loadWorld((xPos -= 10), yPos)

        break
      default:
        loadWorld(xPos, yPos)
        break
    }

    ctx.fillStyle = 'blue'
    ctx.fillRect(
      Math.round((canvas.width - tileSize) / 2 / tileSize) * tileSize,
      Math.round((canvas.height - tileSize) / 2 / tileSize) * tileSize,
      tileSize,
      tileSize
    )
  })
}

playerMovement()
