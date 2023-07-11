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

module.exports = makeRandomMove;
