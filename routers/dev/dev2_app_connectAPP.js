const oracledb = require('oracledb');
const dbConfig = require('../../config/dbConf');
var Results = "";
let connection;
var resultSetData = {};
var fetchEnvAPPData = [];

const fetchSqlQuery='SELECT APPLICATION_NAME, SUB_APPLICATION_NAME, SOURCE_APPLICATION, TARGET_APPLICATION, APPL_SERVICE_NAME, APPL_SERVICE_TYPE, APPL_CONFIGURATION_URL, APPL_PACKAGE_NAME, DECODE(APPL_SERVICE_STATUS, \'CRITICAL\', \'RED\', \'NORMAL\', \'GREEN\', \'HIGH\', \'AMBER\') APPL_SERVICE_STATUS FROM DEV2_CONFIG_DATA ORDER BY ID ASC';
const getDEV2APPConfig = (request, response) => {
    run();
    async function run() {
        try{
            connection = await oracledb.getConnection(dbConfig);
            Results = await connection.execute(fetchSqlQuery,[], // no bind variables
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
                    "appl_service_name" : row[4],           //appl_database_name variable
                    "appl_service_type" : row[5],           //appl_service_type variable
                    "appl_configuration_url" : row[6],      //appl_configuration_url variable
                    "appl_package_name" : row[7],           //appl_package_name variable
                    "appl_service_status" : row[8]          //appl_service_status variable
                };
                fetchEnvAPPData.push(resultSetData);
            }
            // always close the ResultSet
            await rs.close();
        }
        catch(err){
            console.error(err);
        } finally {
            if (connection) {
              try {
                await connection.close();
              } catch (err) {
                console.error(err);
              }
            }
          }
          response.json(fetchEnvAPPData);
    }
};

const insertDEV2APPConfig = (request, response) => {
    const insertSqlQuery='INSERT INTO DEV2_CONFIG_DATA(APPLICATION_NAME, SUB_APPLICATION_NAME, SOURCE_APPLICATION, TARGET_APPLICATION, APPL_SERVICE_NAME, APPL_SERVICE_TYPE, APPL_SERVICE_STATUS, APPL_CONFIGURATION_URL, APPL_PACKAGE_NAME, INFO_ENTRYDATE) values(:application_name, :sub_application_name, :source_application, :target_application, :appl_service_name, :appl_service_type, :appl_configuration_url, :appl_package_name, to_date(:info_entrydate, \'DD-MM-YYYY\'))';
    const {application_name, sub_application_name, source_application, target_application, appl_service_name, appl_service_type, appl_configuration_url, appl_package_name, info_entrydate } = request.body;
    run();
    async function run() {
        try{
            connection = await oracledb.getConnection(dbConfig);
            Results = await connection.execute(insertSqlQuery,
                [application_name, sub_application_name, source_application, target_application, appl_service_name, appl_service_name_version, appl_service_type, appl_configuration_url, appl_package_name, info_entrydate], // bind variables
                { autoCommit: true }  // Override the default, non-autocommit behavior
            );
        }
        catch(err){
            console.error(err);
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
    response.status(201).send(`New Entry in the Table DEV2_CONFIG_DATA added.`)
};

const updateDEV2APPConfig = (request, response) => {
    const {application_name, sub_application_name, source_application, target_application, appl_service_name, appl_service_type, appl_package_name, info_entrydate, id } = request.body;
    var Id = parseInt(id);
    const updateSqlQuery = 'UPDATE DEV2_CONFIG_DATA SET application_name = :appl_name, sub_application_name = :sub_appl_name, source_application = :source_appl, target_application = :target_appl, appl_service_name = :appl_srv_name, appl_service_type = :appl_srv_type, appl_service_status = :appl_srv_status, appl_package_name = :appl_pkg_name, info_entrydate= to_date(:info_entrydate, \'DD-MM-YYYY\') WHERE id = :id';
    run();
    async function run() {
        try{
            connection = await oracledb.getConnection(dbConfig);
            Results = await connection.execute(
                updateSqlQuery,
                {
                    appl_name: application_name,
                    sub_appl_name: sub_application_name,
                    source_appl: source_application,
                    target_appl: target_application,
                    appl_srv_name: appl_service_name,
                    appl_srv_type: appl_service_type,
                    appl_srv_status: appl_service_status,
                    appl_pkg_name: appl_package_name,
                    info_entrydate: info_entrydate,
                    id: Id
                },
                { autoCommit: true }
            );
        }
        catch(err){
            console.error(err);
        } finally {
            if (connection) {
              try {
                await connection.close();
              } catch (err) {
                console.error(err);
              }
            }
          }
        response.status(200).send(`Table DEV2_CONFIG_DATA modified with ID: ${id}`)
    }
}

const deleteDEV2APPConfigById = (request, response) => {
    const { id } = request.body;
    var Id = parseInt(id);
    const deleteSqlQuery = 'DELETE FROM DEV2_CONFIG_DATA WHERE id = :id';
    run();
    async function run() {
        try{
            connection = await oracledb.getConnection(dbConfig);
            Results = await connection.execute(
                deleteSqlQuery,
                {
                    id: Id
                },
                { autoCommit: true }
            );
        }
        catch(err){
            console.error(err);
        } finally {
            if (connection) {
              try {
                await connection.close();
              } catch (err) {
                console.error(err);
              }
            }
          }
        response.status(200).send(`Entry from Table DEV2_CONFIG_DATA deleted with ID: ${id}`)
    }
}

module.exports = {
    getDEV2APPConfig,
    insertDEV2APPConfig,
    updateDEV2APPConfig,
    deleteDEV2APPConfigById
}