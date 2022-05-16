const db_details = require("../config.json")
const mysql = require('mysql2/promise');
const { param } = require("../routes");

const getConnection = async() =>{
    try {
        console.log("Creating connection..");
        const hostname = db_details.db.host;
        const username = db_details.db.username;
        const password = db_details.db.password;
        const database = db_details.db.database;
        const port = db_details.db.port;

        const connection = await mysql.createConnection({
            host: hostname,
            user: username,
            password: password,
            database: database,
            port: port
        });

        console.log("Connection created successfully!!!");
        return connection;
    } catch (error) {
        console.log("Error while creating connection :: ",error);
        throw error;
    }
}

const selectQuery = async(query,params) =>{
    try {
        console.log("Into query sql file..");
        let connection =await getConnection();
        let getQuery = await connection.query(
            query,params
        );
        console.log("Query executed successfully!!!");
        return getQuery[0];
    } catch (error) {
        console.log("Error while select query :: ",error);
        throw error;
    }
}

const insertQuery = async(query,params) =>{
    try {
        console.log("Into query sql file..");
        let connection =await getConnection();
        let getQuery = await connection.query(
            query,params
        );
        console.log("KInsert Query executed successfully!!!");
        return getQuery[0];
    } catch (error) {
        console.log("Error while executing query :: ",error);
        throw error;
    }
}

module.exports = {
    getConnection: getConnection,
    insertQuery: insertQuery,
    selectQuery: selectQuery
};