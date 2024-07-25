const mysql = require("mysql2");
const dbConnection = mysql.createPool({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    user: "root",
    password: "",
    database: "chula"
});

module.exports = dbConnection;