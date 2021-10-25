const gameSize = 3;
const winSize = 3;
const gamePlayersCount = 2;
const gameField = document.querySelector('.game_field');
// const gameRows = gameField.querySelectorAll('.row');
const gameCellsArr = gameField.querySelectorAll('.cell');
const colors = {
  green: 'green',
};
const gamePlayers = [
  'cross',
  'circle',
];
const gameFigures = {
  cross: `<svg class="blue" width="80" height="78" viewBox="0 0 80 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="6.53553" y1="3" x2="77.411" y2="73.8755" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
        <line x1="3" y1="73.8755" x2="73.8755" y2="3.00005" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`,
  circle: `<svg class="red" width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="37.205" cy="37.205" r="34.705" stroke="currentColor" stroke-width="5"/></svg>`,
};

const restartGameBtn = document.querySelector('.restart-button');
const stopGameButton = document.querySelector('.stop-button');

const gameCounter = [];

let endOfGame = false;
let gameStore = null;
let playerSwitcher = true;

function clearGameField(gameCells) {
  gameCells.forEach((item) => {
    item.innerHTML = '';
  });
}

function renderGameField(gameCells) {
  for (let i = 0; i < gameCells.length; i += 1) {
    const gameValue = gameFigures[gameStore[i]];
    if (gameValue) {
      const cell = gameCells[i];
      cell.innerHTML = gameValue;
    }
  }
}

function createFilledDoubleArray(first, second, value) {
  return Array(first).fill(0).map(() => Array(second).fill(value));
}

function countDiagsResults(store, size) {
  const diagResults = createFilledDoubleArray(gamePlayersCount, size, 0);
  diagResults.forEach((item, index) => {
    for (let i = 0; i < size * size; i += size + 1) {
      if (store[i] === gamePlayers[index]) { diagResults[index][0] += 1; }
    }
    for (let i = size - 1; i < size * (size - 1) + 1; i += size - 1) {
      if (store[i] === gamePlayers[index]) { diagResults[index][1] += 1; }
    }
  });
  return diagResults;
}

function countRowsForUsers(store, size) {
  const rowsResults = createFilledDoubleArray(gamePlayersCount, size, 0);

  rowsResults.forEach((item, index) => {
    for (let i = 0; i < size; i += 1) {
      for (let j = i * size; j < i * size + size; j += 1) {
        if (store[j] === gamePlayers[index]) { rowsResults[index][i] += 1; }
      }
    }
  });
  return rowsResults;
}

function countColumnsForUsers(store, size) {
  const columnResults = createFilledDoubleArray(gamePlayersCount, size, 0);

  columnResults.forEach((item, index) => {
    for (let i = 0; i < size; i += 1) {
      for (let j = i; j < i + size * (size - 1) + 1; j += size) {
        if (store[j] === gamePlayers[index]) { columnResults[index][i] += 1; }
      }
    }
  });
  return columnResults;
}

function gameVictory(player) {
  endOfGame = true;
  const playerIndex = gamePlayers.indexOf(player);
  gameCounter[playerIndex].innerText = parseInt(gameCounter[playerIndex].textContent, 10) + 1;
  gameCellsArr.forEach((element) => {
    // eslint-disable-next-line no-use-before-define
    element.removeEventListener('click', setGameValue);
  });
}

function checkGameVictory(store, size) {
  const rowsResults = countRowsForUsers(store, size);
  const columnsResults = countColumnsForUsers(store, size);
  const diagonalResults = countDiagsResults(store, size);

  rowsResults.forEach((playerRow, playerIndex) => {
    if (!endOfGame) {
      playerRow.forEach((rowItem, itemIndex) => {
        if (rowItem === winSize) {
          for (let i = itemIndex * size; i < itemIndex * size + size; i += 1) {
            gameCellsArr[i].firstChild.classList = colors.green;
          }
          gameVictory(gamePlayers[playerIndex]);
        }
      });
    }
  });

  columnsResults.forEach((playerColumn, playerIndex) => {
    if (!endOfGame) {
      playerColumn.forEach((columnItem, itemIndex) => {
        if (columnItem === winSize) {
          for (let i = itemIndex; i < size * size; i += 3) {
            gameCellsArr[i].firstChild.classList = colors.green;
          }
          gameVictory(gamePlayers[playerIndex]);
        }
      });
    }
  });
  diagonalResults.forEach((playerDiag, playerIndex) => {
    if (!endOfGame) {
      playerDiag.forEach((diagonalItem, itemIndex) => {
        if (diagonalItem === winSize) {
          switch (itemIndex) {
            case 0:
              for (let i = 0; i < size * size; i = i + size + 1) {
                gameCellsArr[i].firstChild.classList = colors.green;
              }
              break;
            case 1:
              for (let i = size - 1; i < size * (size - 1) + 1; i = i + size - 1) {
                gameCellsArr[i].firstChild.classList = colors.green;
              }
              break;
            default:
              break;
          }
          gameVictory(gamePlayers[playerIndex]);
        }
      });
    }
  });
}

function setGameValue(event) {
  const element = event.target;
  gameStore[element.id - 1] = playerSwitcher
    ? 'cross'
    : 'circle';
  playerSwitcher = !playerSwitcher;
  renderGameField(gameCellsArr);
  element.removeEventListener('click', setGameValue);
  checkGameVictory(gameStore, gameSize);
}

function gameStart() {
  endOfGame = false;
  clearGameField(gameCellsArr);
  gameStore = Array(gameCellsArr.length).fill(0);
  playerSwitcher = true;

  gameCellsArr.forEach((cell) => {
    cell.addEventListener('click', setGameValue);
  });
}

gameCounter.push(document.querySelector('.p2_count'));
gameCounter.push(document.querySelector('.p1_count'));
restartGameBtn.addEventListener('click', () => {
  if (endOfGame) {
    gameStart();
  }
});
stopGameButton.addEventListener('click', gameStart);

gameStart();
