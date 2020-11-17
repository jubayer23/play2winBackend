const mysql = require("mysql");
var mysqlConnection = mysql.createConnection({
    host : "test.cqyfksx8uik6.eu-west-1.rds.amazonaws.com",
    user : "admin",
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