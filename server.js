const express = require('express');
const bodyParser = require('body-parser');
var logger = require('morgan');
require('dotenv').config();
const cors = require('cors');
const app = express();
var path = require('path');
const port = process.env.PORTNO;
const envName = process.env.NODE_ENV;

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
var devenv1APPConfDataRoutes = require('./routers/dev/showDevAPPEnv1Data');
var devenv2APPConfDataRoutes = require('./routers/dev/showDevAPPEnv2Data');
var devenv1DBConfDataRoutes = require('./routers/dev/showDevDBEnv1Data');
var devenv2DBConfDataRoutes = require('./routers/dev/showDevDBEnv2Data');

// Main Page Router..
app.use('/', mainPageRoutes);

// For Dev Envs..
var dev2confdb = require('./routers/dev/dev2_db_connectDB');

// DEV Routers...
app.use('/showDevAPPEnv1Data', devenv1APPConfDataRoutes);
app.use('/showDevAPPEnv2Data', devenv2APPConfDataRoutes);
app.use('/showDevDBEnv1Data', devenv1DBConfDataRoutes);
app.use('/showDevDBEnv2Data', devenv2DBConfDataRoutes);

// DEV1 ENV CRUD Routers....

// DEV2 DB CRUD routers...
app.get('/getDEV2DBConfig', dev2confdb.getDEV2DBConfig);
app.post('/insertDEV2DBConfig', dev2confdb.insertDEV2DBConfig);
app.put('/updateDEV2DBConfig', dev2confdb.updateDEV2DBConfig);

app.listen(port, () => console.log(`Env Mgmt Dashboard App listening on port ${port}!`));