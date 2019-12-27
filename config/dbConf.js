require('dotenv').config();

module.exports = {
    user: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    connectString: ""
};