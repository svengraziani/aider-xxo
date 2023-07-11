const express = require('express');
const app = express();
app.use(express.json());
const port = 3001;

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:');

db.run('CREATE TABLE games (id INTEGER PRIMARY KEY, board TEXT, players TEXT, turn TEXT)');

let game = {
  id: null,
  board: Array(9).fill(null),
  players: {},
  turn: 'X'
};

function checkGameStatus(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return 'win';
    }
  }
  if (board.includes(null)) {
    return 'continue';
  } else {
    return 'draw';
  }
}

function makeRandomMove(board, role) {
  let available = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      available.push(i);
    }
  }
  let move = available[Math.floor(Math.random() * available.length)];
  board[move] = role;
  return board;
}

app.get('/health', (req, res) => {
  res.send('Server is healthy');
});

app.post('/start', (req, res) => {
  const { name } = req.body;
  const role = Math.random() < 0.5 ? 'X' : 'O';
  game.players[role] = name;
  res.json({ name, role });
});

app.post('/play', (req, res) => {
  const { name, role, move } = req.body;
  if (game.players[role] !== name || game.turn !== role) {
    return res.status(400).json({ error: 'Not your turn' });
  }
  game.board[move] = role;
  game.turn = role === 'X' ? 'O' : 'X';
  const status = checkGameStatus(game.board);
  if (status !== 'continue') {
    return res.json({ status });
  }
  game.board = makeRandomMove(game.board, game.turn);
  game.turn = game.turn === 'X' ? 'O' : 'X';
  res.json({ board: game.board });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
