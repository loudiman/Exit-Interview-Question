const express = require('express');
const app = express();

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the home page!');
});


const PORT = 80
app.listen(PORT, ()=>{
  console.log('Server is running');
});