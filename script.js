const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

//BLOCKS
const tileSize = 50

const water_block = '#239ac9'
const sand_block = '#ebf55b'
const grass_block = '#228b22'
const stone_block = '#767c7e'
const coal_block = '#000'
const copper_block = '#ff5e00'
const iron_block = '#a5a5a5'
const snow_block = '#fff'

//WORLD GENERATION
const centerWorldX = -Math.round((canvas.width - tileSize) / (2 * tileSize)) * tileSize * 5
const centerWorldY = -Math.round((canvas.height - tileSize) / (2 * tileSize)) * tileSize * 5

const row = Math.round(canvas.width / tileSize) * 5
const column = Math.round(canvas.height / tileSize) * 5

let terrain = []

function assignTempeture() {
  let simplexTempeture = new SimplexNoise()
  const tempetureNoiseScale = 0.015

  for (let x = 0; x < row; x++) {
    let terrainRow = []

    for (let y = 0; y < column; y++) {
      let tempetureNoiseValue = simplexTempeture.noise2D(x * tempetureNoiseScale, y * tempetureNoiseScale)
      tempetureNoiseValue = (tempetureNoiseValue + 1) / 2

      if (tempetureNoiseValue >= 0.66) {
        ctx.fillStyle = snow_block
      } else if (tempetureNoiseValue >= 0.33) {
        ctx.fillStyle = grass_block
      } else if (tempetureNoiseValue >= 0) {
        ctx.fillStyle = sand_block
      }
      terrainRow.push(ctx.fillStyle)
    }
    terrain.push(terrainRow)
  }
  loadWorld(centerWorldX, centerWorldY)
}
//assignTempeture()

function generateWorld() {
  const simplexTerrain = new SimplexNoise()
  const noiseScale = 0.03

  for (let x = 0; x < row; x++) {
    let terrainRow = []

    for (let y = 0; y < column; y++) {
      let noiseValue = simplexTerrain.noise2D(x * noiseScale, y * noiseScale)
      noiseValue = (noiseValue + 1) / 2

      if (noiseValue <= 0.4) {
        ctx.fillStyle = water_block
      } else if (noiseValue <= 0.7) {
        ctx.fillStyle = grass_block
      } else if (noiseValue <= 0.9) {
        ctx.fillStyle = stone_block
      } else {
        ctx.fillStyle = snow_block
      }
      terrainRow.push(ctx.fillStyle)
    }
    terrain.push(terrainRow)
  }

  generateSand()
  generateOres()

  loadWorld(centerWorldX, centerWorldY)
}
generateWorld()

function generateSand() {
  let simplexSand = new SimplexNoise()
  const sandNoiseScale = 0.03

  terrain.forEach((x, xi) => {
    x.forEach((y, yi) => {
      let sandNoiseValue = simplexSand.noise2D(xi * sandNoiseScale, yi * sandNoiseScale)
      sandNoiseValue = (sandNoiseValue + 1) / 2

      if (y == grass_block) {
        if (
          x[yi + 1] == water_block ||
          x[yi - 1] == water_block ||
          (terrain[xi + 1] && terrain[xi + 1][yi]) == water_block ||
          (terrain[xi - 1] && terrain[xi - 1][yi]) == water_block
        ) {
          if (sandNoiseValue > 0.45) {
            terrain[xi][yi] = sand_block
          }
        }
      }
    })
  })
}

function generateOres() {
  let simplexOres = new SimplexNoise()

  terrain.forEach((x, xi) => {
    x.forEach((y, yi) => {
      let oresNoiseValue = simplexOres.noise2D(xi, yi)
      oresNoiseValue = (oresNoiseValue + 1) / 2

      if (y == stone_block) {
        if (oresNoiseValue > 0.95) {
          terrain[xi][yi] = iron_block
        } else if (oresNoiseValue > 0.9) {
          terrain[xi][yi] = copper_block
        } else if (oresNoiseValue > 0.85) {
          terrain[xi][yi] = coal_block
        }
      }
    })
  })
}

function loadWorld(offsetX, offsetY) {
  for (let x = 0; x < row; x++) {
    for (let y = 0; y < column; y++) {
      ctx.fillStyle = terrain[x][y]

      ctx.fillRect(x * tileSize + offsetX, y * tileSize + offsetY, tileSize, tileSize)
    }
  }
}

//PLAYER & PLAYER MOVEMENT
function spawnPlayer() {
  ctx.fillStyle = 'blue'
  ctx.fillRect(
    Math.round((canvas.width - tileSize) / (2 * tileSize)) * tileSize,
    Math.round((canvas.height - tileSize) / (2 * tileSize)) * tileSize,
    tileSize,
    tileSize
  )
}

function playerMovement() {
  let xPos = centerWorldX
  let yPos = centerWorldY
  spawnPlayer()

  document.addEventListener('keydown', (event) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
      case 'Numpad8':
        loadWorld(xPos, (yPos += 10))
        break
      case 'KeyA':
      case 'ArrowLeft':
      case 'Numpad4':
        loadWorld((xPos += 10), yPos)
        break
      case 'KeyS':
      case 'ArrowDown':
      case 'Numpad2':
        loadWorld(xPos, (yPos -= 10))
        break
      case 'KeyD':
      case 'ArrowRight':
      case 'Numpad6':
        loadWorld((xPos -= 10), yPos)
        break
      default:
        loadWorld(xPos, yPos)
        break
    }

    spawnPlayer()

    console.clear()
    console.log(`x: ${-xPos} \ny: ${-yPos}`)
  })
}
playerMovement()
