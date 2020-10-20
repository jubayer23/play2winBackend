const mysql = require("mysql");
var mysqlConnection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password: "password",
    database: "test",
    multipleStatements : true
});

mysqlConnection.connect((err) => {
    if(!err){

        console.log("connected")
    }else{
        console.log(err)
        console.log("Not connected")
    }
})

module.exports = mysqlConnection