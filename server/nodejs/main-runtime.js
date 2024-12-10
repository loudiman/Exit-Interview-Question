const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authenticateToken = require('./middleware/auth');
const path = require('path')

const app = express();

app.use(cors({
   origin: 'http://localhost:8888',
   methods: ['GET', 'POST'],
   allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());


const publicDir = (express.static(path.join(__dirname, "resources")))

//Middleware that exposes the css resources statically
app.use('/static/css', express.static(path.join(__dirname,"resources","css")))

//Middleware that serves font
app.use('/static/fonts', express.static(path.join(__dirname,"resources","fonts")))

app.use('/static/images', express.static(path.join(__dirname,"resources","images")))

//Middleware that exposes the js resources statically
app.use('/static/js',express.static(path.join(__dirname,"resources","js")))

app.use(`/static/images`,express.static(path.join(__dirname,"resources","images")))

//Serve entrance endpoint
// Protect the route serving index.html for admin users only
app.get('/', authenticateToken, (req, res) => {
   if (req.user.userType === 0) {
      res.sendFile(path.join(__dirname, 'resources', 'index.html'));
   } else {
      res.status(403).send('Access denied: Admins only');
   }
});
module.exports = app