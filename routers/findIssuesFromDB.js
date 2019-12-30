var express = require('express');
var router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../config/dbConf');
var Results = "";
let connection;
var fetchEnvDBData = [];


const get_data_from_DB = (request, response) => {
    const fetchSqlQuery='select appl_service_status_info from (select appl_service_name, appl_service_status_info from dev2_db_config_data union select appl_service_name, appl_service_status_info from dev1_db_config_data union select appl_service_name, appl_service_status_info from dev1_config_data union select appl_service_name, appl_service_status_info from dev2_config_data) where appl_service_name=:appl_service_name';
    const { appl_name, appl_srv_name } = request.query;
    run();
    async function run() {
        try{
            connection = await oracledb.getConnection(dbConfig);
            Results = await connection.execute(fetchSqlQuery, { appl_service_name: appl_srv_name } , // no bind variables
            {
                resultSet: true // return a ResultSet (default is false)
            });
            const rs = Results.resultSet;
            CriticalDataRow = await rs.getRow();

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
          response.send(CriticalDataRow);
    }
};

module.exports = {
    get_data_from_DB
};