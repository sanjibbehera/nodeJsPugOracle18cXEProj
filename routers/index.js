var express = require('express');
var router = express.Router();
require('dotenv').config();
const envName = process.env.NODE_ENV;
const oracledb = require('oracledb');
const dbConfig = require('../config/dbConf');
console.log(envName);
var Results ="";
var numRows = 0;
let connection;
var resultSetData = {};
var envData = [];

// For a complete list of options see the documentation.
options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    // extendedMetaData: true,   // get extra metadata
    // fetchArraySize: 100       // internal buffer allocation size for tuning
};


if(envName==='dev'){
    run();
    async function run() {
        try{
            connection = await oracledb.getConnection(dbConfig);
            Results = await connection.execute(`SELECT COUNT(*) MON_APPL_CNTR, ENVIRONMENT_NAME FROM DEV_ENV_APPL GROUP BY ENVIRONMENT_NAME UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'DEV1_UNAV_APP' FROM DEV1_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'DEV1_AV_PROC' FROM DEV1_CONFIG_DATA WHERE APPL_SERVICE_TYPE='PROCESSES' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'DEV1_AV_WEB' FROM DEV1_CONFIG_DATA WHERE APPL_SERVICE_TYPE='WEBSERVICES' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'DEV1_AV_GUI' FROM DEV1_CONFIG_DATA WHERE APPL_SERVICE_TYPE='GUISERVICES' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'DEV2_UNAV_APP' FROM DEV2_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'DEV2_AV_PROC' FROM DEV2_CONFIG_DATA WHERE APPL_SERVICE_TYPE='PROCESSES' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'DEV2_AV_WEB' FROM DEV2_CONFIG_DATA WHERE APPL_SERVICE_TYPE='WEBSERVICES' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'DEV2_AV_GUI' FROM DEV2_CONFIG_DATA WHERE APPL_SERVICE_TYPE='GUISERVICES' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'DEV1_UNAV_DB' FROM DEV1_DB_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'DEV1_SERVTYP_DB' FROM DEV1_DB_CONFIG_DATA WHERE APPL_SERVICE_TYPE='DB' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'DEV1_SERVTYP_GG' FROM DEV1_DB_CONFIG_DATA WHERE APPL_SERVICE_TYPE='GG' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'DEV2_UNAV_DB' FROM DEV2_DB_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'DEV2_SERVTYP_DB' FROM DEV2_DB_CONFIG_DATA WHERE APPL_SERVICE_TYPE='DB' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'DEV2_SERVTYP_GG' FROM DEV2_DB_CONFIG_DATA WHERE APPL_SERVICE_TYPE='GG'`,
            [], // no bind variables
            {
              resultSet: true // return a ResultSet (default is false)
            }
          );
          const rs = Results.resultSet;
          let row;

          while ((row = await rs.getRow())) {
            //console.log(row);
            resultSetData = {
                "mon_appl_cntr" : row[0],    //counter variable
                "environment_name" : row[1]   //environment_name variable
            };
            envData.push(resultSetData);
          }      
          // always close the ResultSet
          await rs.close();
        }
        catch(err){
            console.error(err);
        }
    }
}
else if(envName==='test'){
    run();
    async function run() {
        try{
            connection = await oracledb.getConnection(dbConfig);
            Results = await connection.execute(`SELECT COUNT(*) MON_APPL_CNTR, ENVIRONMENT_NAME FROM TEST_ENV_APPL GROUP BY ENVIRONMENT_NAME UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'TEST1_UNAV_APP' FROM TEST1_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'TEST1_AV_PROC' FROM TEST1_CONFIG_DATA WHERE APPL_SERVICE_TYPE='PROCESSES' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'TEST1_AV_WEB' FROM TEST1_CONFIG_DATA WHERE APPL_SERVICE_TYPE='WEBSERVICES' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'TEST1_AV_GUI' FROM TEST1_CONFIG_DATA WHERE APPL_SERVICE_TYPE='GUISERVICES' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'TEST2_UNAV_APP' FROM TEST2_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'TEST2_AV_PROC' FROM TEST2_CONFIG_DATA WHERE APPL_SERVICE_TYPE='PROCESSES' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'TEST2_AV_WEB' FROM TEST2_CONFIG_DATA WHERE APPL_SERVICE_TYPE='WEBSERVICES' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'TEST2_AV_GUI' FROM TEST2_CONFIG_DATA WHERE APPL_SERVICE_TYPE='GUISERVICES' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'TEST1_UNAV_DB' FROM TEST1_DB_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'TEST1_SERVTYP_DB' FROM TEST1_DB_CONFIG_DATA WHERE APPL_SERVICE_TYPE='DB' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'TEST1_SERVTYP_GG' FROM TEST1_DB_CONFIG_DATA WHERE APPL_SERVICE_TYPE='GG' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'TEST2_UNAV_DB' FROM TEST2_DB_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'TEST2_SERVTYP_DB' FROM TEST2_DB_CONFIG_DATA WHERE APPL_SERVICE_TYPE='DB' UNION ALL SELECT COUNT(*) MON_APPL_CNTR, 'TEST2_SERVTYP_GG' FROM TEST2_DB_CONFIG_DATA WHERE APPL_SERVICE_TYPE='GG'`,
            [], // no bind variables
            {
              resultSet: true // return a ResultSet (default is false)
            }
          );
          const rs = Results.resultSet;
          let row;

          while ((row = await rs.getRow())) {
            //console.log(row);
            resultSetData = {
                "mon_appl_cntr" : row[0],    //counter variable
                "environment_name" : row[1]   //environment_name variable
            };
            envData.push(resultSetData);
          }      
          // always close the ResultSet
          await rs.close();
        }
        catch(err){
            console.error(err);
        }
    }
}

router.get('/', function(req, res) {
    res.render('main/index', {title: 'Environment Management Dashboard', navbar_title: 'Welcome to Environment Configuration Managed System', 
        envDataList: envData}, function(err, html) {
        if (err) {
            //res.redirect('/404');
            res.status(404).end('error');
        } else {
            console.log('Data sent to Pug: ',envData);
            res.status(200).send(html);
        }
    });
});

module.exports = router;