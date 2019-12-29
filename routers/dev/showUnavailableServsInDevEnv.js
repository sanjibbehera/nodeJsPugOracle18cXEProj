var express = require('express');
var router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../../config/dbConf');

var ResultsDevDB1 ="";
var ResultsDevDB2 ="";
var ResultsDevAPP1 ="";
var ResultsDevAPP2 ="";
var ResultsDevAPP1WS ="";
var ResultsDevAPP2WS ="";
var ResultsOverall = "";
let connection;
var resultSetDataDevDB1 = {};
var resultSetDataDevDB2 = {};
var resultSetDataDevAPP1 = {};
var resultSetDataDevAPP2 = {};
var resultSetDataDevAPP1WS = {};
var resultSetDataDevAPP2WS = {};
var resultSetDataOverall = {};
var unavailableDataDevDB1 = [];
var unavailableDataDevDB2 = [];
var unavailableDataDevAPP1 = [];
var unavailableDataDevAPP2 = [];
var unavailableDataDevAPP1WS = [];
var unavailableDataDevAPP2WS = [];
var overallData = [];

// For a complete list of options see the documentation.
options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    // extendedMetaData: true,   // get extra metadata
    // fetchArraySize: 100       // internal buffer allocation size for tuning
};

function loadDevUnavailableServices(){
    unavailableDataDevDB1 = [];
    unavailableDataDevDB2 = [];
    unavailableDataDevAPP1 = [];
    unavailableDataDevAPP2 = [];
    unavailableDataDevAPP1WS = [];
    unavailableDataDevAPP2WS = [];
    overallData = [];
    run();

    async function run() {
        try{
            let rowDevDB1, rowDevDB2, rowDevAPP1, rowDevAPP2, rowDevAPP1WS, rowDevAPP2WS;
            connection = await oracledb.getConnection(dbConfig);

            ResultsOverall = await connection.execute(`SELECT COUNT(*) CNTR, 'DEV1_DB_CONFIG_DATA_UNAVSRV' AS TABS FROM DEV1_DB_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL'
                                                UNION ALL
                                                SELECT COUNT(*) CNTR, 'DEV2_DB_CONFIG_DATA_UNAVSRV' AS TABS FROM DEV2_DB_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL'
                                                UNION ALL
                                                SELECT COUNT(*) CNTR, 'DEV1_CONFIG_DATA_UNAVSRV' AS TABS FROM DEV1_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL' AND APPL_SERVICE_TYPE='Processes'
                                                UNION ALL
                                                SELECT COUNT(*) CNTR, 'DEV2_CONFIG_DATA_UNAVSRV' AS TABS FROM DEV2_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL' AND APPL_SERVICE_TYPE='Processes'
                                                UNION ALL
                                                SELECT COUNT(*) CNTR, 'DEV1_WS_CONFIG_DATA_UNAVSRV' AS TABS FROM DEV1_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL' AND APPL_SERVICE_TYPE!='Processes'
                                                UNION ALL
                                                SELECT COUNT(*) CNTR, 'DEV2_WS_CONFIG_DATA_UNAVSRV' AS TABS FROM DEV2_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL' AND APPL_SERVICE_TYPE!='Processes'
                                                UNION ALL
                                                SELECT COUNT(*) CNTR, 'DEV1_DB_CONFIG_DATA_TOTSRV' AS TABS FROM DEV1_DB_CONFIG_DATA
                                                UNION ALL
                                                SELECT COUNT(*) CNTR, 'DEV2_DB_CONFIG_DATA_TOTSRV' AS TABS FROM DEV2_DB_CONFIG_DATA
                                                UNION ALL
                                                SELECT COUNT(*) CNTR, 'DEV1_CONFIG_DATA_TOTSRV' AS TABS FROM DEV1_CONFIG_DATA WHERE APPL_SERVICE_TYPE='Processes'
                                                UNION ALL
                                                SELECT COUNT(*) CNTR, 'DEV2_CONFIG_DATA_TOTSRV' AS TABS FROM DEV2_CONFIG_DATA WHERE APPL_SERVICE_TYPE='Processes'
                                                UNION ALL
                                                SELECT COUNT(*) CNTR, 'DEV1_WS_CONFIG_DATA_TOTSRV' AS TABS FROM DEV1_CONFIG_DATA WHERE APPL_SERVICE_TYPE!='Processes'
                                                UNION ALL
                                                SELECT COUNT(*) CNTR, 'DEV2_WS_CONFIG_DATA_TOTSRV' AS TABS FROM DEV2_CONFIG_DATA WHERE APPL_SERVICE_TYPE!='Processes'`,
            [], // no bind variables
            {
            resultSet: true // return a ResultSet (default is false)
            });
            const rsOverall = ResultsOverall.resultSet;

            while ((row = await rsOverall.getRow())) {
                resultSetDataOverall = {
                    "counter" : row[0],            //counter variable
                    "tab_name": row[1]           //table_name variable
                };
                overallData.push(resultSetDataOverall);
            }

            ResultsDevDB1 = await connection.execute(`SELECT APPLICATION_NAME, APPL_SERVICE_NAME, 'DEV1_DB_CONFIG_DATA' AS TABS FROM DEV1_DB_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL'`,
            [], // no bind variables
            {
            resultSet: true // return a ResultSet (default is false)
            });
            const rsDevDB1 = ResultsDevDB1.resultSet;

            while ((row = await rsDevDB1.getRow())) {
                resultSetDataDevDB1 = {
                    "application_name" : row[0],            //application_name variable
                    "appl_service_name" : row[1],           //appl_service_name variable
                    "table_name": row[2]
                };
                unavailableDataDevDB1.push(resultSetDataDevDB1);
            }

            ResultsDevDB2 = await connection.execute(`SELECT APPLICATION_NAME, APPL_SERVICE_NAME, 'DEV2_DB_CONFIG_DATA' AS TABS FROM DEV2_DB_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL'`,
            [], // no bind variables
            {
            resultSet: true // return a ResultSet (default is false)
            });
            const rsDevDB2 = ResultsDevDB2.resultSet;

            while ((row = await rsDevDB2.getRow())) {
                resultSetDataDevDB2 = {
                    "application_name" : row[0],            //application_name variable
                    "appl_service_name" : row[1],           //appl_service_name variable
                    "table_name": row[2]
                };
                unavailableDataDevDB2.push(resultSetDataDevDB2);
            }  

            ResultsDevAPP1 = await connection.execute(`SELECT APPLICATION_NAME, APPL_SERVICE_NAME, 'DEV2_DB_CONFIG_DATA' AS TABS FROM DEV1_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL' AND APPL_SERVICE_TYPE='Processes'`,
            [], // no bind variables
            {
            resultSet: true // return a ResultSet (default is false)
            });
            const rsDevAPP1 = ResultsDevAPP1.resultSet;

            while ((row = await rsDevAPP1.getRow())) {
                resultSetDataDevAPP1 = {
                    "application_name" : row[0],            //application_name variable
                    "appl_service_name" : row[1],           //appl_service_name variable
                    "table_name": row[2]
                };
                unavailableDataDevAPP1.push(resultSetDataDevAPP1);
            } 

            ResultsDevAPP2 = await connection.execute(`SELECT APPLICATION_NAME, APPL_SERVICE_NAME, 'DEV2_DB_CONFIG_DATA' AS TABS FROM DEV2_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL' AND APPL_SERVICE_TYPE='Processes'`,
            [], // no bind variables
            {
            resultSet: true // return a ResultSet (default is false)
            });
            const rsDevAPP2 = ResultsDevAPP2.resultSet;

            while ((row = await rsDevAPP2.getRow())) {
                resultSetDataDevAPP2 = {
                    "application_name" : row[0],            //application_name variable
                    "appl_service_name" : row[1],           //appl_service_name variable
                    "table_name": row[2]
                };
                unavailableDataDevAPP2.push(resultSetDataDevAPP2);
            }  

            ResultsDevAPP1WS = await connection.execute(`SELECT APPLICATION_NAME, APPL_SERVICE_NAME, 'DEV2_DB_CONFIG_DATA' AS TABS FROM DEV1_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL' AND APPL_SERVICE_TYPE!='Processes'`,
            [], // no bind variables
            {
            resultSet: true // return a ResultSet (default is false)
            });
            const rsDevAPP1WS = ResultsDevAPP1WS.resultSet;

            while ((row = await rsDevAPP1WS.getRow())) {
                resultSetDataDevAPP1WS = {
                    "application_name" : row[0],            //application_name variable
                    "appl_service_name" : row[1],           //appl_service_name variable
                    "table_name": row[2]
                };
                unavailableDataDevAPP1WS.push(resultSetDataDevAPP1WS);
            } 

            ResultsDevAPP2WS = await connection.execute(`SELECT APPLICATION_NAME, APPL_SERVICE_NAME, 'DEV2_DB_CONFIG_DATA' AS TABS FROM DEV2_CONFIG_DATA WHERE APPL_SERVICE_STATUS='CRITICAL' AND APPL_SERVICE_TYPE!='Processes'`,
            [], // no bind variables
            {
            resultSet: true // return a ResultSet (default is false)
            });
            const rsDevAPP2WS = ResultsDevAPP2WS.resultSet;

            while ((row = await rsDevAPP2WS.getRow())) {
                resultSetDataDevAPP2WS = {
                    "application_name" : row[0],            //application_name variable
                    "appl_service_name" : row[1],           //appl_service_name variable
                    "table_name": row[2]
                };
                unavailableDataDevAPP2WS.push(resultSetDataDevAPP2WS);
            } 
            // always close the ResultSet
            await rsOverall.close();
            await rsDevDB1.close();
            await rsDevDB2.close();
            await rsDevAPP1.close();
            await rsDevAPP2.close();
            await rsDevAPP1WS.close();
            await rsDevAPP2WS.close();
        }
        catch(error){
            console.error(error);
        }
    }

    router.get('/', function(req, res) {
        res.render('dev/showUnavailableServsDevDataConf', {title: 'Environment Management Dashboard', navbar_title: 'Welcome to Environment Configuration Managed System',
        overallDataList: overallData, unavailableDev1DBDataList: unavailableDataDevDB1, unavailableDev2DBDataList: unavailableDataDevDB2, 
        unavailableDev1APPDataList: unavailableDataDevAPP1, unavailableDev2APPDataList: unavailableDataDevAPP2, 
        unavailableDev1APPWSDataList: unavailableDataDevAPP1WS, unavailableDev2APPWSDataList: unavailableDataDevAPP2WS}, function(err, html) {
            if (err) {
                //res.redirect('/404');
                res.status(404).end('error');
            } else {
                res.status(200).send(html);
            }
        });
    });
}

loadDevUnavailableServices();

setInterval(function(){
    loadDevUnavailableServices() // this will run after every 120 seconds
}, 120000);

module.exports = router;