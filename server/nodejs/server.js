// Note this is just an example of nodejs 

const express = require('express');
const app = express();
const port = 8000;

app.use(express.json()); // Middleware to parse JSON bodies

const items = [
  { id: 1, name: 'Item One' },
  { id: 2, name: 'Item Two' }
];

// GET endpoint to home page
// app.get('/', (req, res) => {
//     res.render('/Repositories/index.html');
//     res.json(items);
// });

// GET endpoint to retrieve all items
app.get('/api/items', (req, res) => {
  res.json(items);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
  