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

module.exports = {
    clearGameField,
    renderGameField
}
