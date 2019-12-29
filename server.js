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
var dev1confdb = require('./routers/dev/dev1_db_connectDB');
var dev1confapp = require('./routers/dev/dev1_app_connectAPP');
var dev2confdb = require('./routers/dev/dev2_db_connectDB');
var dev2confapp = require('./routers/dev/dev2_app_connectAPP');
var showUnavailableServsInDevEnv = require('./routers/dev/showUnavailableServsInDevEnv');

// DEV Routers...
app.use('/showDevAPPEnv1Data', devenv1APPConfDataRoutes);
app.use('/showDevAPPEnv2Data', devenv2APPConfDataRoutes);
app.use('/showDevDBEnv1Data', devenv1DBConfDataRoutes);
app.use('/showDevDBEnv2Data', devenv2DBConfDataRoutes);
app.use('/unavailableDevServsData', showUnavailableServsInDevEnv);

// DEV1 ENV CRUD Routers....
app.get('/getDEV1DBConfig', dev1confdb.getDEV1DBConfig);
app.post('/insertDEV1DBConfig', dev1confdb.insertDEV1DBConfig);
app.put('/updateDEV1DBConfig', dev1confdb.updateDEV1DBConfig);
app.delete('/deleteDEV1DBConfigById', dev1confdb.deleteDEV1DBConfigById);
app.get('/getDEV1APPConfig', dev1confapp.getDEV1APPConfig);
app.post('/insertDEV1APPConfig', dev1confapp.insertDEV1APPConfig);
app.put('/updateDEV1APPConfig', dev1confapp.updateDEV1APPConfig);
app.delete('/deleteDEV1APPConfigById', dev1confapp.deleteDEV1APPConfigById);

// DEV2 DB CRUD routers...
app.get('/getDEV2DBConfig', dev2confdb.getDEV2DBConfig);
app.post('/insertDEV2DBConfig', dev2confdb.insertDEV2DBConfig);
app.put('/updateDEV2DBConfig', dev2confdb.updateDEV2DBConfig);
app.delete('/deleteDEV2DBConfigById', dev2confdb.deleteDEV2DBConfigById);
app.get('/getDEV2APPConfig', dev2confapp.getDEV2APPConfig);
app.post('/insertDEV2APPConfig', dev2confapp.insertDEV2APPConfig);
app.put('/updateDEV2APPConfig', dev2confapp.updateDEV2APPConfig);
app.delete('/deleteDEV2APPConfigById', dev2confapp.deleteDEV2APPConfigById);

app.listen(port, () => console.log(`Env Mgmt Dashboard App listening on port ${port}!`));