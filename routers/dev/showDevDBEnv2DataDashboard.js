var express = require('express');
var router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../../config/dbConf');

var NormalResults ="";
var HighResults ="";
var CriticalResults ="";
var OverallResults = "";
var AppsResults = "";
let connection;
var NormalResultSetData = {};
var HighResultSetData = {};
var CriticalResultSetData = {};
var NormalDBServsData = [];
var HighDBServsData = [];
var CriticalDBServsData = [];
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
    NormalDBServsData = [];  
    HighDBServsData = [];  
    CriticalDBServsData = [];
    criticalDBServiceData = [];
    overallDBData = [];
    appsData = [];
    run();

    async function run() {
        try{
            connection = await oracledb.getConnection(dbConfig);
            NormalResults = await connection.execute(`select APPLICATION_NAME, APPL_SERVICE_STATUS, COUNTS  from 
                (SELECT serv.application_name, srv_stat.APPL_SERVICE_STATUS, coalesce(TBL.CNTR , 0) COUNTS 
                FROM (SELECT distinct application_name FROM dev2_db_config_data) SERV 
                CROSS JOIN (SELECT 'CRITICAL' AS APPL_SERVICE_STATUS FROM DUAL 
                        UNION SELECT 'HIGH' AS APPL_SERVICE_STATUS FROM DUAL 
                        UNION SELECT 'NORMAL' AS APPL_SERVICE_STATUS FROM DUAL) SRV_STAT 
                LEFT JOIN (SELECT APPLICATION_NAME, APPL_SERVICE_STATUS, COUNT(*) CNTR 
                FROM dev2_db_config_data GROUP BY APPLICATION_NAME, APPL_SERVICE_STATUS) TBL 
                ON TBL.APPLICATION_NAME = SERV.APPLICATION_NAME AND SRV_STAT.APPL_SERVICE_STATUS = TBL.APPL_SERVICE_STATUS 
                ORDER BY serv.application_name, srv_stat.appl_service_status desc) WHERE APPL_SERVICE_STATUS='NORMAL'`,
            [], // no bind variables
            {
                resultSet: true // return a ResultSet (default is false)
            });
            HighResults = await connection.execute(`select APPLICATION_NAME, APPL_SERVICE_STATUS, COUNTS  from 
                (SELECT serv.application_name, srv_stat.APPL_SERVICE_STATUS, coalesce(TBL.CNTR , 0) COUNTS 
                FROM (SELECT distinct application_name FROM dev2_db_config_data) SERV 
                CROSS JOIN (SELECT 'CRITICAL' AS APPL_SERVICE_STATUS FROM DUAL 
                        UNION SELECT 'HIGH' AS APPL_SERVICE_STATUS FROM DUAL 
                        UNION SELECT 'NORMAL' AS APPL_SERVICE_STATUS FROM DUAL) SRV_STAT 
                LEFT JOIN (SELECT APPLICATION_NAME, APPL_SERVICE_STATUS, COUNT(*) CNTR 
                FROM dev2_db_config_data GROUP BY APPLICATION_NAME, APPL_SERVICE_STATUS) TBL 
                ON TBL.APPLICATION_NAME = SERV.APPLICATION_NAME AND SRV_STAT.APPL_SERVICE_STATUS = TBL.APPL_SERVICE_STATUS 
                ORDER BY serv.application_name, srv_stat.appl_service_status desc) WHERE APPL_SERVICE_STATUS='HIGH'`,
            [], // no bind variables
            {
                resultSet: true // return a ResultSet (default is false)
            });
            CriticalResults = await connection.execute(`select APPLICATION_NAME, APPL_SERVICE_STATUS, COUNTS  from 
                (SELECT serv.application_name, srv_stat.APPL_SERVICE_STATUS, coalesce(TBL.CNTR , 0) COUNTS 
                FROM (SELECT distinct application_name FROM dev2_db_config_data) SERV 
                CROSS JOIN (SELECT 'CRITICAL' AS APPL_SERVICE_STATUS FROM DUAL 
                        UNION SELECT 'HIGH' AS APPL_SERVICE_STATUS FROM DUAL 
                        UNION SELECT 'NORMAL' AS APPL_SERVICE_STATUS FROM DUAL) SRV_STAT 
                LEFT JOIN (SELECT APPLICATION_NAME, APPL_SERVICE_STATUS, COUNT(*) CNTR 
                FROM dev2_db_config_data GROUP BY APPLICATION_NAME, APPL_SERVICE_STATUS) TBL 
                ON TBL.APPLICATION_NAME = SERV.APPLICATION_NAME AND SRV_STAT.APPL_SERVICE_STATUS = TBL.APPL_SERVICE_STATUS 
                ORDER BY serv.application_name, srv_stat.appl_service_status desc) WHERE APPL_SERVICE_STATUS='CRITICAL'`,
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
            const NormalRs = NormalResults.resultSet;
            let NormalRow;
            const HighRs = HighResults.resultSet;
            let HighRow;
            const CriticalRs = CriticalResults.resultSet;
            let CriticalRow;
            const overallRS = OverallResults.resultSet;
            let overallRow;
            const AppsRS = AppsResults.resultSet;
            let appsRow;

            while ((NormalRow = await NormalRs.getRow())) {
                NormalResultSetData = {
                    "application_name" : NormalRow[0],            //application_name variable
                    "counts" : NormalRow[2],                     //counter variable
                };
                NormalDBServsData.push(NormalResultSetData);
            }

            while ((HighRow = await HighRs.getRow())) {
                HighResultSetData = {
                    "application_name" : HighRow[0],            //application_name variable
                    "counts" : HighRow[2],                     //counter variable
                };
                HighDBServsData.push(HighResultSetData);
            }

            while ((CriticalRow = await CriticalRs.getRow())) {
                CriticalResultSetData = {
                    "application_name" : CriticalRow[0],            //application_name variable
                    "counts" : CriticalRow[2],                     //counter variable
                };
                CriticalDBServsData.push(CriticalResultSetData);
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
            await NormalRs.close();
            await HighRs.close();
            await CriticalRs.close();
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
        NormalDBServsDataList: NormalDBServsData, HighDBServsDataList: HighDBServsData, CriticalDBServsDataList: CriticalDBServsData,
        criticalDBServicesList: criticalDBServiceData, overallDBList: overallDBData, appList: appsData}, function(err, html) {
            if (err) {
                //res.redirect('/404');
                res.status(404).end('error');
            } else {
                //console.log(appsData);
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