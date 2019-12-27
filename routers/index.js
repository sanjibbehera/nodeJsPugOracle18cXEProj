var express = require('express');
var router = express.Router();
require('dotenv').config();
const envName = process.env.NODE_ENV;
const oracledb = require('oracledb');
const dbConfig = require('../config/dbConf');
console.log(envName);
var resultSet ="";
let connection;
binds = {};

// For a complete list of options see the documentation.
options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    // extendedMetaData: true,   // get extra metadata
    // fetchArraySize: 100       // internal buffer allocation size for tuning
};

run();

async function run() {
    if(envName==='dev'){
        try{
            connection = await oracledb.getConnection(dbConfig);
            resultSet = await connection.execute(`select COUNT(*) mon_appl_cntr, environment_name FROM dev_env_appl GROUP BY environment_name`);
            console.log(resultSet.rows);
            envData=resultSet.rows;
        }
        catch(err){
            console.error(err);
        }
    }
}

router.get('/', function(req, res) {
    res.render('main/index', {title: 'Environment Management Dashboard', navbar_title: 'Welcome to Environment Configuration Managed System',
    monServdataList: envData}, function(err, html) {
        if (err) {
            //res.redirect('/404');
            res.status(404).end('error');
        } else {
            //console.log(envData);
            res.status(200).send(html);
        }
    });
  });

module.exports = router;