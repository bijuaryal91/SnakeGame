const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let snake = [{ x: 9 * box, y: 9 * box }];
let direction = '';
let food = spawnFood();
let score = 0;

const foodSound = new Audio('./music/food.mp3');
const gameOverSound = new Audio('./music/gameover.mp3');
const moveSound = new Audio('./music/move.mp3');

document.addEventListener('keydown', changeDirection);
setInterval(game, 100);

function changeDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
        moveSound.play();
    } else if (event.keyCode === 38 && direction !== 'DOWN') {
        direction = 'UP';
        moveSound.play();
    } else if (event.keyCode === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
        moveSound.play();
    } else if (event.keyCode === 40 && direction !== 'UP') {
        direction = 'DOWN';
        moveSound.play();
    }
}

function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
}

function game() {
    if (isGameOver()) {
        clearInterval(game);
        gameOverSound.play();
        alert('Game Over! Your score: ' + score);
        document.location.reload();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        drawFood();
        moveSnake();
        drawScore(); // Call to draw score
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'green' : 'lightgreen';
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(segment.x, segment.y, box, box);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);
}

function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };

    if (direction === 'LEFT') head.x -= box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'DOWN') head.y += box;

    if (head.x === food.x && head.y === food.y) {
        score++;
        foodSound.play();
        food = spawnFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

function drawScore() {
    ctx.fillStyle = 'white'; // Set score text color
    ctx.font = '20px Arial'; // Set font style
    ctx.fillText('Score: ' + score, box, box); // Draw the score on canvas
}

function isGameOver() {
    const head = snake[0];

    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        return true;
    }
    return false;
}
