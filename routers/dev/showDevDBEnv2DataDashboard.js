var express = require('express');
var router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../../config/dbConf');

var Results ="";
var OverallResults = "";
var AppsResults = "";
let connection;
var resultSetData = {};
var db2appData = [];
var resultsappData = {};
var appsData = [];
var criticalDBServiceData = [];
var overallResultSetData = {};
var overallDBData = [];

// For a complete list of options see the documentation.
options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    // extendedMetaData: true,   // get extra metadata
    // fetchArraySize: 100       // internal buffer allocation size for tuning
};

function loadDashboardDataForDevDBEnv2Page(){
    
    db2appData = [];
    criticalDBServiceData = [];
    overallDBData = [];
    appsData = [];
    run();

    async function run() {
        try{
            connection = await oracledb.getConnection(dbConfig);
            Results = await connection.execute(`select APPLICATION_NAME,  'TOTAL NO OF MONITORED SERVICES' as "APPL_SERVICE_STATUS" , COUNTS FROM (
                select APPLICATION_NAME,  COUNT(*) COUNTS FROM dev2_db_config_data GROUP BY APPLICATION_NAME ORDER BY APPLICATION_NAME)
                UNION ALL
                select APPLICATION_NAME, APPL_SERVICE_STATUS, COUNTS  from 
                (SELECT serv.application_name, srv_stat.APPL_SERVICE_STATUS, coalesce(TBL.CNTR , 0) COUNTS 
                FROM (SELECT distinct application_name FROM dev2_db_config_data) SERV 
                CROSS JOIN (SELECT 'CRITICAL' AS APPL_SERVICE_STATUS FROM DUAL 
                        UNION SELECT 'HIGH' AS APPL_SERVICE_STATUS FROM DUAL 
                        UNION SELECT 'NORMAL' AS APPL_SERVICE_STATUS FROM DUAL) SRV_STAT 
                LEFT JOIN (SELECT APPLICATION_NAME, APPL_SERVICE_STATUS, COUNT(*) CNTR 
                FROM dev2_db_config_data GROUP BY APPLICATION_NAME, APPL_SERVICE_STATUS) TBL 
                ON TBL.APPLICATION_NAME = SERV.APPLICATION_NAME AND SRV_STAT.APPL_SERVICE_STATUS = TBL.APPL_SERVICE_STATUS 
                ORDER BY serv.application_name, srv_stat.appl_service_status desc)`,
            [], // no bind variables
            {
                resultSet: true // return a ResultSet (default is false)
            });
            OverallResults = await connection.execute(`SELECT 'TOTAL MONITORED SERVICES' AS "APPL_SERVICE_STATUS", COUNT(*) AS COUNTS FROM dev2_db_config_data
            UNION
            SELECT srv_stat.APPL_SERVICE_STATUS, coalesce(TBL.CNTR , 0) COUNTS
            FROM
            (SELECT 'CRITICAL' AS APPL_SERVICE_STATUS FROM DUAL 
                    UNION SELECT 'HIGH' AS APPL_SERVICE_STATUS FROM DUAL 
                    UNION SELECT 'NORMAL' AS APPL_SERVICE_STATUS FROM DUAL) SRV_STAT 
            LEFT JOIN (SELECT APPL_SERVICE_STATUS, COUNT(*) CNTR 
            FROM dev2_db_config_data GROUP BY APPL_SERVICE_STATUS) TBL 
            ON SRV_STAT.APPL_SERVICE_STATUS = TBL.APPL_SERVICE_STATUS`,
            [], // no bind variables
            {
                resultSet: true // return a ResultSet (default is false)
            });
            AppsResults = await connection.execute(`select distinct application_name from dev2_db_config_data order by application_name`,
            [], // no bind variables
            {
                resultSet: true // return a ResultSet (default is false)
            });
            const rs = Results.resultSet;
            let row;
            const overallRS = OverallResults.resultSet;
            let overallRow;
            const AppsRS = AppsResults.resultSet;
            let appsRow;

            while ((row = await rs.getRow())) {
                resultSetData = {
                    "application_name" : row[0],            //application_name variable
                    "appl_service_status" : row[1],         //appl_service_status variable
                    "counts" : row[2],                     //counter variable
                };
                db2appData.push(resultSetData);
                if(row[1] === 'CRITICAL'){
                    criticalDBServiceData.push(resultSetData);
                }
            }
            while ((overallRow = await overallRS.getRow())) {
                overallResultSetData = {
                    "appl_service_status" : overallRow[0],         //appl_service_status variable
                    "counts" : overallRow[1],                     //counter variable
                };
                overallDBData.push(overallResultSetData);
            }
            while ((appsRow = await AppsRS.getRow())) {
                resultsappData = {
                    "application_name" : appsRow[0],         //appl_service_status variable
                };
                appsData.push(resultsappData);
            }         
            // always close the ResultSet
            await rs.close();
            await overallRS.close();
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
        res.render('dev/showDev2DBDataDashboard', {title: 'Environment Management Dashboard', navbar_title: 'Welcome to Environment Configuration Managed System',
        db2DataList: db2appData, criticalDBServicesList: criticalDBServiceData, overallDBList: overallDBData, appList: appsData}, function(err, html) {
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