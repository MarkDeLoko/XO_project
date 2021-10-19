const gameSize = 3
const winSize = 3
const gamePlayersCount = 2
const gameField = document.querySelector('.game_field')
const gamePlayers = [
    'cross',
    'circle'
]
const gameFigures = {
    cross: `<svg class="blue" width="80" height="78" viewBox="0 0 80 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="6.53553" y1="3" x2="77.411" y2="73.8755" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
        <line x1="3" y1="73.8755" x2="73.8755" y2="3.00005" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`,
    circle: `<svg class="red" width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="37.205" cy="37.205" r="34.705" stroke="currentColor" stroke-width="5"/></svg>`
}
const restartGameBtn = document.querySelector('.restart-button')
const stopGameButton = document.querySelector('.stop-button')
const gameCellsArr = gameField.querySelectorAll('.cell')
const gameCounter = []

let endOfGame = false
let gameStore = null
let playerSwitcher = true

gameCounter.push(document.querySelector('.p2_count'))
gameCounter.push(document.querySelector('.p1_count'))
restartGameBtn.addEventListener('click', () => {
    if (endOfGame) {
        gameStart()
    }
})
stopGameButton.addEventListener('click', gameStart)


function gameStart() {
    endOfGame = false
    clearGameField(gameCellsArr)
    gameStore = Array.apply(null, {length: gameCellsArr.length}).map(() => 0)
    playerSwitcher = true

    gameCellsArr.forEach((cell) => {
        cell.addEventListener('click', setGameValue)
    })
}


function setGameValue(event) {
    const element = event.target
    gameStore[element.id - 1] = playerSwitcher
        ? 'cross'
        : 'circle'
    playerSwitcher = !playerSwitcher
    renderGameField(gameCellsArr)
    element.removeEventListener('click', setGameValue)
    checkGameVictory(gameStore, gameSize)
}

function renderGameField(gameCells) {
    for (let i = 0; i < gameCells.length; i++) {
        const gameValue = gameFigures[gameStore[i]]
        if (gameValue) {
            const cell = gameCells[i]
            cell.innerHTML = gameValue
        }
    }
}

function checkGameVictory(gameStore, size) {
    const rowsResults = countRowsForUsers(gameStore, size)
    const columnsResults = countColumnsForUsers(gameStore, size)
    const diagonalResults = countDiagsResults(gameStore, size)

    rowsResults.forEach((playerRow, playerIndex) => {
        if (!endOfGame) {
            if (playerRow.includes(winSize)) {
                gameVictory(gamePlayers[playerIndex])
                return
            }
        }
    })
    columnsResults.forEach((playerRow, playerIndex) => {
        if (!endOfGame) {
            if (playerRow.includes(winSize)) {
                gameVictory(gamePlayers[playerIndex])
                return
            }
        }
    })
    diagonalResults.forEach((playerRow, playerIndex) => {
        if (!endOfGame) {
            if (playerRow.includes(winSize)) {
                gameVictory(gamePlayers[playerIndex])
                return
            }
        }
    })
}

function gameVictory(player) {
    endOfGame = true
    const playerIndex = gamePlayers.indexOf(player)
    gameCounter[playerIndex].innerText = parseInt(gameCounter[playerIndex].textContent) + 1
    gameCellsArr.forEach((element) => {
        element.removeEventListener('click', setGameValue)
    })
}

function clearGameField(gameCells) {
    gameCells.forEach((item) => {
        item.innerHTML = ''
    })
}

function countDiagsResults(gameStore, size) {
    let diagResults = []
    for (let i = 0; i < gamePlayersCount; i++) {
        diagResults.push(new Array(size - 1))
    }
    diagResults.forEach((item) => {
        item.fill(0)
    })
    diagResults.forEach((item, index) => {

        for (let i = 0; i < size * size; i = i + size + 1) {
            if (gameStore[i] === gamePlayers[index])
                diagResults[index][0] = diagResults[index][0] + 1
        }
        for (let i = size - 1; i < size * (size - 1) + 1; i = i + size - 1) {
            if (gameStore[i] === gamePlayers[index])
                diagResults[index][1] = diagResults[index][1] + 1
        }
    })
    return diagResults
}


function countRowsForUsers(gameStore, size) {
    let rowsResults = []
    for (let i = 0; i < gamePlayersCount; i++) {
        rowsResults.push(new Array(size))
    }
    rowsResults.forEach((item) => {
        item.fill(0)
    })

    rowsResults.forEach((item, index) => {
        for (let i = 0; i < size; i++) {
            for (let j = i * size; j < i * size + size; j++) {
                if (gameStore[j] === gamePlayers[index])
                    rowsResults[index][i] = rowsResults[index][i] + 1
            }
        }
    })
    return rowsResults
}

function countColumnsForUsers(gameStore, size) {
    let columnResults = []
    for (let i = 0; i < gamePlayersCount; i++) {
        columnResults.push(new Array(size))
    }
    columnResults.forEach((item) => {
        item.fill(0)
    })

    columnResults.forEach((item, index) => {
        for (let i = 0; i < size; i++) {
            for (let j = i; j < i + size * (size - 1) + 1; j = j + size) {
                if (gameStore[j] === gamePlayers[index])
                    columnResults[index][i] = columnResults[index][i] + 1
            }
        }
    })
    return columnResults
}

gameStart()
