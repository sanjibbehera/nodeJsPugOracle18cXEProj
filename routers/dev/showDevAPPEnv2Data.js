var express = require('express');
var router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../../config/dbConf');

var Results ="";
let connection;
var resultSetData = {};
var env2appData = [];

// For a complete list of options see the documentation.
options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    // extendedMetaData: true,   // get extra metadata
    // fetchArraySize: 100       // internal buffer allocation size for tuning
};

function loadDevAPPEnv2Page(){
    env2appData = [];
    run();

    async function run() {
        try{
            connection = await oracledb.getConnection(dbConfig);
            Results = await connection.execute(`SELECT APPLICATION_NAME, NVL(SUB_APPLICATION_NAME, 'N/A') SUB_APPLICATION_NAME, NVL(SOURCE_APPLICATION, 'N/A') SOURCE_APPLICATION, NVL(TARGET_APPLICATION, 'N/A') TARGET_APPLICATION, APPL_SERVICE_NAME, NVL(APPL_SERVICE_NAME_VERSION, 'N/A') APPL_SERVICE_NAME_VERSION, NVL(APPL_CONFIGURATION_URL, 'N/A') APPL_CONFIGURATION_URL, APPL_PACKAGE_NAME, APPL_SERVICE_TYPE, DECODE(APPL_SERVICE_STATUS, 'CRITICAL', 'RED', 'NORMAL', 'GREEN', 'HIGH', 'AMBER') APPL_SERVICE_STATUS FROM DEV2_CONFIG_DATA ORDER BY ID ASC`,
            [], // no bind variables
            {
            resultSet: true // return a ResultSet (default is false)
            });
            const rs = Results.resultSet;
            let row;

            while ((row = await rs.getRow())) {
                resultSetData = {
                    "application_name" : row[0],            //application_name variable
                    "sub_application_name" : row[1],        //sub_application_name variable
                    "source_application" : row[2],          //source_application variable
                    "target_application" : row[3],          //target_application variable
                    "appl_service_name" : row[4],           //appl_service_name variable
                    "appl_service_name_version" : row[5],   //appl_service_name_version variable
                    "appl_configuration_url" : row[6] ,     //appl_configuration_url variable
                    "appl_package_name" : row[7],           //appl_package_name variable
                    "appl_service_type" : row[8],           //appl_package_name variable
                    "appl_service_status" : row[9]          //appl_package_name variable
                };
                env2appData.push(resultSetData);
            }      
            // always close the ResultSet
            await rs.close();
        }
        catch(error){
            console.error(error);
        }
    }

    router.get('/', function(req, res) {
        res.render('dev/showDev2APPDataConf', {title: 'Environment Management Dashboard', navbar_title: 'Welcome to Environment Configuration Managed System',
        app2DataList: env2appData}, function(err, html) {
            if (err) {
                //res.redirect('/404');
                res.status(404).end('error');
            } else {
                //console.log(DB2ConfData);
                res.status(200).send(html);
            }
        });
    });
}

loadDevAPPEnv2Page();

setInterval(function(){
    loadDevAPPEnv2Page() // this will run after every 120 seconds
}, 120000);

module.exports = router;