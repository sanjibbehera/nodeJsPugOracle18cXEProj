var express = require('express');
var router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../../config/dbConf');

var Results ="";
let connection;
var resultSetData = {};
var db2appData = [];

// For a complete list of options see the documentation.
options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    // extendedMetaData: true,   // get extra metadata
    // fetchArraySize: 100       // internal buffer allocation size for tuning
};



function loadDashboardDataForDevDBEnv2Page(){
    
    db2appData = [];
    run();

    async function run() {
        try{
            connection = await oracledb.getConnection(dbConfig);
            Results = await connection.execute(`SELECT serv.application_name, srv_stat.APPL_SERVICE_STATUS, coalesce(TBL.CNTR , 0) COUNTS FROM (SELECT distinct application_name FROM dev2_db_config_data) SERV CROSS JOIN (SELECT 'CRITICAL' AS APPL_SERVICE_STATUS FROM DUAL UNION SELECT 'HIGH' AS APPL_SERVICE_STATUS FROM DUAL UNION SELECT 'NORMAL' AS APPL_SERVICE_STATUS FROM DUAL) SRV_STAT LEFT JOIN (SELECT APPLICATION_NAME, APPL_SERVICE_STATUS, COUNT(*) CNTR FROM dev2_db_config_data GROUP BY APPLICATION_NAME, APPL_SERVICE_STATUS) TBL ON TBL.APPLICATION_NAME = SERV.APPLICATION_NAME AND SRV_STAT.APPL_SERVICE_STATUS = TBL.APPL_SERVICE_STATUS ORDER BY serv.application_name, srv_stat.appl_service_status`,
            [], // no bind variables
            {
            resultSet: true // return a ResultSet (default is false)
            });
            const rs = Results.resultSet;
            let row;

            while ((row = await rs.getRow())) {
                resultSetData = {
                    "application_name" : row[0],            //application_name variable
                    "appl_service_status" : row[1],          //appl_package_name variable
                    "counter" : row[2],          //appl_package_name variable
                };
                db2appData.push(resultSetData);
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
        res.render('dev/showDev2DBDataDasboard', {title: 'Environment Management Dashboard', navbar_title: 'Welcome to Environment Configuration Managed System',
        db2DataList: db2appData}, function(err, html) {
            if (err) {
                //res.redirect('/404');
                res.status(404).end('error');
            } else {
                console.log(db2appData);
                res.status(200).send(html);
            }
        });
    });
}

loadDashboardDataForDevDBEnv2Page();

setInterval(function(){
    loadDashboardDataForDevDBEnv2Page() // this will run after every 120 seconds
}, 120000);

module.exports = router;