require('dotenv').config();
const express = require('express');

const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join('/index.html'));
});

app.listen(port, () => {
  console.log(`listening on port ${ port }`);
});
