const express = require('express');
const app = express();
app.use(express.json());
const port = 3001;

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./games.db');

db.run('CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY, board TEXT, players TEXT, turn TEXT, start_date TEXT, last_move_date TEXT, status TEXT)');

let game = {
  id: null,
  board: Array(9).fill(null),
  players: {},
  turn: 'X'
};

const checkGameStatus = require('./checkGameStatus.js');
const makeRandomMove = require('./makeRandomMove.js');

app.get('/health', (req, res) => {
  res.send('Server is healthy');
});

app.post('/start', (req, res) => {
  const { name } = req.body;
  const role = Math.random() < 0.5 ? 'X' : 'O';
  game.players[role] = name;
  game.start_date = new Date().toISOString();
  game.status = 'in progress';
  res.json({ name, role });
});

app.post('/play', (req, res) => {
  const { name, role, move } = req.body;
  if (game.players[role] !== name || game.turn !== role) {
    return res.status(400).json({ error: 'Not your turn' });
  }
  game.board[move] = role;
  game.turn = role === 'X' ? 'O' : 'X';
  game.last_move_date = new Date().toISOString();
  const status = checkGameStatus(game.board);
  if (status !== 'continue') {
    game.status = 'complete';
    return res.json({ status });
  }
  game.board = makeRandomMove(game.board, game.turn);
  game.turn = game.turn === 'X' ? 'O' : 'X';
  res.json({ board: game.board });
});

app.get('/games', (req, res) => {
  db.all('SELECT * FROM games', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
