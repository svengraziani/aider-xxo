const express = require('express');
const app = express();
app.use(express.json());
const port = 3001;

let game = {
  board: Array(9).fill(null),
  players: {},
  turn: 'X'
};

function checkGameStatus(board) {
  // Check rows, columns, and diagonals for a win
  // Return 'win', 'draw', or 'continue'
}

function makeRandomMove(board, role) {
  // Make a random valid move and return the updated board
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
