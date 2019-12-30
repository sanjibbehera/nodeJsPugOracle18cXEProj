var express = require('express');
var router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../../config/dbConf');

var Results ="";
let connection;
var resultSetData = {};
var db1appData = [];

// For a complete list of options see the documentation.
options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    // extendedMetaData: true,   // get extra metadata
    // fetchArraySize: 100       // internal buffer allocation size for tuning
};

function loadDevDBEnv1Page(){
    db1appData = [];
    run();

    async function run() {
        try{
            connection = await oracledb.getConnection(dbConfig);
            Results = await connection.execute(`SELECT APPLICATION_NAME, APPL_DATABASE_NAME, APPL_SERVICE_NAME, APPL_DB_SERVICE_DETAILS, APPL_DB_PACKAGE_NAME, APPL_SERVICE_TYPE, DECODE(APPL_SERVICE_STATUS, 'CRITICAL', 'RED', 'NORMAL', 'GREEN', 'HIGH', 'AMBER') APPL_SERVICE_STATUS FROM DEV1_DB_CONFIG_DATA ORDER BY ID ASC`,
            [], // no bind variables
            {
            resultSet: true // return a ResultSet (default is false)
            });
            const rs = Results.resultSet;
            let row;

            while ((row = await rs.getRow())) {
                resultSetData = {
                    "application_name" : row[0],            //application_name variable
                    "appl_database_name" : row[1],          //appl_database_name variable
                    "appl_service_name" : row[2],           //appl_service_name variable
                    "appl_db_service_details" : row[3],     //appl_db_service_details variable
                    "appl_db_package_name" : row[4],        //appl_package_name variable
                    "appl_service_type" : row[5],           //appl_package_name variable
                    "appl_service_status" : row[6]          //appl_package_name variable
                };
                db1appData.push(resultSetData);
            }      
            // always close the ResultSet
            await rs.close();
        }
        catch(error){
            console.error(error);
        } finally {
            if (connection) {
              try {
                await connection.close();
              } catch (err) {
                console.error(err);
              }
            }
          }
    }

    router.get('/', function(req, res) {
        res.render('dev/showDev1DBDataConf', {title: 'Environment Management Dashboard', navbar_title: 'Welcome to Environment Configuration Managed System',
        db1DataList: db1appData}, function(err, html) {
            if (err) {
                //res.redirect('/404');
                res.status(404).end('error');
            } else {
                //console.log(DB1ConfData);
                res.status(200).send(html);
            }
        });
    });
}

loadDevDBEnv1Page();

setInterval(function(){
    loadDevDBEnv1Page() // this will run after every 5 seconds
}, 120000);

module.exports = router;