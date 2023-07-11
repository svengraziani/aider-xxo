const express = require('express');
const app = express();
const port = 3001;

app.get('/health', (req, res) => {
  res.send('Server is healthy');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
