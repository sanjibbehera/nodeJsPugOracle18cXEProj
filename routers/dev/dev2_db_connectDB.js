const oracledb = require('oracledb');
const dbConfig = require('../../config/dbConf');
var Results ="";
let connection;
var resultSetData = {};
var fetchEnvDBData = [];

const fetchSqlQuery='SELECT APPLICATION_NAME, APPL_DATABASE_NAME, APPL_SERVICE_NAME, APPL_DB_SERVICE_DETAILS, APPL_DB_PACKAGE_NAME, APPL_SERVICE_TYPE, DECODE(APPL_SERVICE_STATUS, \'CRITICAL\', \'RED\', \'NORMAL\', \'GREEN\', \'HIGH\', \'AMBER\') APPL_SERVICE_STATUS FROM DEV2_DB_CONFIG_DATA ORDER BY ID ASC';
const getDEV2DBConfig = (request, response) => {
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
                //console.log(row);
                resultSetData = {
                    "application_name" : row[0],            //application_name variable
                    "appl_database_name" : row[1],          //appl_database_name variable
                    "appl_service_name" : row[2],           //appl_database_name variable
                    "appl_db_service_details" : row[3],     //appl_db_service_details variable
                    "appl_db_package_name" : row[4],        //appl_db_package_name variable
                    "appl_service_type" : row[5],           //appl_service_type variable
                    "appl_service_status" : row[6]          //appl_service_status variable
                };
                fetchEnvDBData.push(resultSetData);
              }      
              // always close the ResultSet
              await rs.close();
        }
        catch(err){
            console.error(err);
        }
    }
    response.json(fetchEnvDBData);
};

const insertDEV2DBConfig = (request, response) => {
    const insertSqlQuery='INSERT INTO DEV2_DB_CONFIG_DATA(APPLICATION_NAME, APPL_DATABASE_NAME, APPL_SERVICE_NAME, APPL_SERVICE_TYPE, APPL_SERVICE_STATUS, APPL_DB_SERVICE_DETAILS, APPL_DB_PACKAGE_NAME, INFO_ENTRYDATE) values(:application_name, :appl_database_name, :appl_service_name, :appl_service_type, :appl_service_status, :appl_db_service_details, :appl_db_package_name, to_date(:info_entrydate, \'DD-MM-YYYY\'))';
    const {application_name, appl_database_name, appl_service_name, appl_service_type, appl_service_status, appl_db_service_details, appl_db_package_name, info_entrydate } = request.body;
    run();
    async function run() {
        try{
            connection = await oracledb.getConnection(dbConfig);
            Results = await connection.execute(insertSqlQuery,
                [application_name, appl_database_name, appl_service_name, appl_service_type, appl_service_status, appl_db_service_details, appl_db_package_name, info_entrydate], // bind variables
                { autoCommit: true }  // Override the default, non-autocommit behavior
            );
        }
        catch(err){
            console.error(err);
        }
    }
    response.status(201).send(`New Entry in the Table DEV2_db_config_data added.`)
};

const updateDEV2DBConfig = (request, response) => {
    const id = parseInt(request.params.id);
    const {application_name, appl_database_name, appl_service_name, appl_service_type, appl_service_status, appl_db_service_details, appl_db_package_name, info_entrydate } = request.body;
    const updateSqlQuery = 'UPDATE DEV2_db_config_data SET application_name = :application_name, appl_database_name = :appl_database_name, appl_service_name = :appl_service_name, appl_service_type = :appl_service_type, appl_service_status = :appl_service_status, appl_db_service_details = :appl_db_service_details, appl_db_package_name = :appl_db_package_name, info_entrydate= to_date(:info_entrydate, \'DD-MM-YYYY\') WHERE id = :id';
    run();
    async function run() {
        try{
            connection = await oracledb.getConnection(dbConfig);
            Results = await connection.execute(
                updateSqlQuery,
                {
                    application_name: application_name,
                    appl_database_name: appl_database_name,
                    appl_service_name: appl_service_name,
                    appl_service_type: appl_service_type,
                    appl_service_status: appl_service_status,
                    appl_db_service_details: appl_db_service_details,
                    appl_db_package_name: appl_db_package_name,
                    info_entrydate: info_entrydate,
                    id: id
                },
                { autoCommit: true }
            );
        }
        catch(err){
            console.error(err);
        }
    }
}

module.exports = {
    getDEV2DBConfig,
    insertDEV2DBConfig,
    updateDEV2DBConfig
}