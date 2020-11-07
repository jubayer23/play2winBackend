const mysql = require("mysql");
var mysqlConnection = mysql.createConnection({
    host : "test.chdzjulmvj4i.eu-west-2.rds.amazonaws.com",
    user : "root",
    password: "zsXrIwCYy0%b",
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