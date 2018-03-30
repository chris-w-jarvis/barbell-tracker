require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('views'));
app.use(express.static('public'));
app.use(express.static('lib'));

app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.listen(port, () => {
  console.log(`listening on port ${ port }`);
});
