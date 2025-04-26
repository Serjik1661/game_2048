document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    const bestDisplay = document.getElementById('best');
    const newGameBtn = document.getElementById('new-game-btn');
    const restartBtn = document.getElementById('restart-btn');
    const gameOverDisplay = document.getElementById('game-over');

    let board = [];
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    let isGameOver = false;

    bestDisplay.textContent = bestScore;

    // Инициализация игры
    function initGame() {
        board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        score = 0;
        isGameOver = false;
        scoreDisplay.textContent = score;
        gameOverDisplay.style.display = 'none';

        // Очищаем сетку
        grid.innerHTML = '';

        // Создаем ячейки
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            grid.appendChild(cell);
        }

        // Добавляем 2 начальные плитки
        addRandomTile();
        addRandomTile();

        updateBoard();
    }

    // Добавляем случайную плитку (2 или 4)
    function addRandomTile() {
        if (isBoardFull()) return;

        let row, col;
        do {
            row = Math.floor(Math.random() * 4);
            col = Math.floor(Math.random() * 4);
        } while (board[row][col] !== 0);

        board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }

    // Проверяем, заполнена ли доска
    function isBoardFull() {
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (board[row][col] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    // Обновляем отображение доски
    function updateBoard() {
        const cells = document.querySelectorAll('.cell');

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const index = row * 4 + col;
                const cell = cells[index];
                const value = board[row][col];

                // Очищаем ячейку
                cell.innerHTML = '';

                if (value !== 0) {
                    const tile = document.createElement('div');
                    tile.classList.add('tile', `tile-${value}`);
                    tile.textContent = value;
                    cell.appendChild(tile);
                }
            }
        }
    }

    // Проверяем, возможен ли ход
    function canMove() {
        // Проверяем наличие пустых клеток
        if (!isBoardFull()) return true;

        // Проверяем возможные слияния по горизонтали
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === board[row][col + 1]) {
                    return true;
                }
            }
        }

        // Проверяем возможные слияния по вертикали
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 3; row++) {
                if (board[row][col] === board[row + 1][col]) {
                    return true;
                }
            }
        }

        return false;
    }

    // Проверяем окончание игры
    function checkGameOver() {
        if (!canMove()) {
            isGameOver = true;
            gameOverDisplay.style.display = 'flex';
        }
    }

    // Двигаем плитки влево
    function moveLeft() {
        let moved = false;

        for (let row = 0; row < 4; row++) {
            // Удаляем нули и объединяем одинаковые плитки
            let newRow = board[row].filter(val => val !== 0);

            for (let i = 0; i < newRow.length - 1; i++) {
                if (newRow[i] === newRow[i + 1]) {
                    newRow[i] *= 2;
                    newRow[i + 1] = 0;
                    score += newRow[i];
                    moved = true;
                }
            }

            // Снова удаляем нули
            newRow = newRow.filter(val => val !== 0);

            // Заполняем оставшиеся позиции нулями
            while (newRow.length < 4) {
                newRow.push(0);
            }

            if (JSON.stringify(board[row]) !== JSON.stringify(newRow)) {
                moved = true;
            }

            board[row] = newRow;
        }

        return moved;
    }

    // Двигаем плитки вправо
    function moveRight() {
        let moved = false;

        for (let row = 0; row < 4; row++) {
            // Удаляем нули и объединяем одинаковые плитки
            let newRow = board[row].filter(val => val !== 0);

            for (let i = newRow.length - 1; i > 0; i--) {
                if (newRow[i] === newRow[i - 1]) {
                    newRow[i] *= 2;
                    newRow[i - 1] = 0;
                    score += newRow[i];
                    moved = true;
                }
            }

            // Снова удаляем нули
            newRow = newRow.filter(val => val !== 0);

            // Заполняем оставшиеся позиции нулями
            while (newRow.length < 4) {
                newRow.unshift(0);
            }

            if (JSON.stringify(board[row]) !== JSON.stringify(newRow)) {
                moved = true;
            }

            board[row] = newRow;
        }

        return moved;
    }

    // Двигаем плитки вверх
    function moveUp() {
        let moved = false;

        for (let col = 0; col < 4; col++) {
            // Получаем столбец
            let column = [board[0][col], board[1][col], board[2][col], board[3][col]];

            // Удаляем нули и объединяем одинаковые плитки
            let newColumn = column.filter(val => val !== 0);

            for (let i = 0; i < newColumn.length - 1; i++) {
                if (newColumn[i] === newColumn[i + 1]) {
                    newColumn[i] *= 2;
                    newColumn[i + 1] = 0;
                    score += newColumn[i];
                    moved = true;
                }
            }

            // Снова удаляем нули
            newColumn = newColumn.filter(val => val !== 0);

            // Заполняем оставшиеся позиции нулями
            while (newColumn.length < 4) {
                newColumn.push(0);
            }

            // Проверяем, изменился ли столбец
            if (JSON.stringify(column) !== JSON.stringify(newColumn)) {
                moved = true;
            }

            // Обновляем столбец в доске
            for (let row = 0; row < 4; row++) {
                board[row][col] = newColumn[row];
            }
        }

        return moved;
    }

    // Двигаем плитки вниз
    function moveDown() {
        let moved = false;

        for (let col = 0; col < 4; col++) {
            // Получаем столбец
            let column = [board[0][col], board[1][col], board[2][col], board[3][col]];

            // Удаляем нули и объединяем одинаковые плитки
            let newColumn = column.filter(val => val !== 0);

            for (let i = newColumn.length - 1; i > 0; i--) {
                if (newColumn[i] === newColumn[i - 1]) {
                    newColumn[i] *= 2;
                    newColumn[i - 1] = 0;
                    score += newColumn[i];
                    moved = true;
                }
            }

            // Снова удаляем нули
            newColumn = newColumn.filter(val => val !== 0);

            // Заполняем оставшиеся позиции нулями
            while (newColumn.length < 4) {
                newColumn.unshift(0);
            }

            // Проверяем, изменился ли столбец
            if (JSON.stringify(column) !== JSON.stringify(newColumn)) {
                moved = true;
            }

            // Обновляем столбец в доске
            for (let row = 0; row < 4; row++) {
                board[row][col] = newColumn[row];
            }
        }

        return moved;
    }

    // Обработка нажатий клавиш
    function handleKeyPress(e) {
        if (isGameOver) return;

        let moved = false;

        switch (e.key) {
            case 'ArrowLeft':
                moved = moveLeft();
                break;
            case 'ArrowRight':
                moved = moveRight();
                break;
            case 'ArrowUp':
                moved = moveUp();
                break;
            case 'ArrowDown':
                moved = moveDown();
                break;
            default:
                return;
        }

        if (moved) {
            addRandomTile();
            updateBoard();
            scoreDisplay.textContent = score;

            if (score > bestScore) {
                bestScore = score;
                bestDisplay.textContent = bestScore;
                localStorage.setItem('bestScore', bestScore);
            }

            checkGameOver();
        }
    }

    // Кнопка новой игры
    newGameBtn.addEventListener('click', initGame);
    restartBtn.addEventListener('click', initGame);

    // Обработка свайпов на мобильных устройствах
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    grid.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, false);

    grid.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, false);

    function handleSwipe() {
        if (isGameOver) return;

        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        let moved = false;

        // Определяем направление свайпа
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                moved = moveRight();
            } else {
                moved = moveLeft();
            }
        } else {
            if (dy > 0) {
                moved = moveDown();
            } else {
                moved = moveUp();
            }
        }

        if (moved) {
            addRandomTile();
            updateBoard();
            scoreDisplay.textContent = score;

            if (score > bestScore) {
                bestScore = score;
                bestDisplay.textContent = bestScore;
                localStorage.setItem('bestScore', bestScore);
            }

            checkGameOver();
        }
    }

    // Запуск игры
    document.addEventListener('keydown', handleKeyPress);
    initGame();
});
