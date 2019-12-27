const express = require('express');
const bodyParser = require('body-parser');
var logger = require('morgan');
require('dotenv').config();
const cors = require('cors');
const app = express();
var path = require('path');
const port = process.env.PORTNO;

// Combines logging info from request and response
app.use(logger('combined'));
app.locals.env = process.env;
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

var mainPageRoutes = require('./routers/index');

//Main Page Router..
app.use('/', mainPageRoutes);

app.listen(port, () => console.log(`Env Mgmt Dashboard App listening on port ${port}!`));