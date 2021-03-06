const express = require("express")
const router = express.Router()
const mysqlConnection = require("../connection")
var async = require('async');
const mysql = require("mysql");
router.get("/", async (req, res) =>{
    var amount = req.query.amount
    var category = req.query.category
    var difficulty = req.query.difficulty
    if(!amount){
       amount = 100
    }
    //var phone = req.query.b
   /// console.log(username)
   // console.log(phone)
    var jsonArr = []
    const promises = []
    var bigOutput = {}
    var output = [];
    var sql = ""
    if(category && difficulty){
        sql = mysql.format("select * from question where category=? && difficulty=? order by rand() LIMIT " + amount,[category, difficulty])
    }else if(category){
        sql = mysql.format("select * from question where category= ? order by rand() LIMIT " + amount, category)
    }else if(difficulty){
        sql = mysql.format("select * from question where difficulty=? order by rand() LIMIT " + amount, difficulty)
    }else{
        sql = "select * from question order by rand()  LIMIT " + amount
    }
    //console.log("sql", sql)
    mysqlConnection.query(sql ,function(error,results,filelds){
        if(error) {
            console.log(error)
        }
        async.eachSeries(results,function(data,callback){ // It will be executed one by one
            //Here it will be wait query execute. It will work like synchronous
            mysqlConnection.query('SELECT * FROM question_choices  where question_id = ' + data.id,function(error,results1,filelds){
                if(error) throw err;
                var json = {}
                json['question'] = data.question
                json['type'] = 'multiple'
                json['difficulty'] = data.difficulty
                json['category'] = data.category
                var json2 = []
                for(var i = 0; i < results1.length; i++){
                    if(results1[i].is_right_choice == 1){
                        json['correct_answer'] = results1[i].choice
                    }else{
                        json2.push(results1[i].choice)
                    }
                }
                json['incorrect_answers'] = json2
                output.push(json)
                callback();
            });
        }, function(err, results) {
            //console.log(output); // Output will the value that you have inserted in array, once for loop completed ex . 1,2,3,4,5,6,7,8,9
            bigOutput['response_code'] = 0
            bigOutput['results'] = output
            res.send(bigOutput)
        });

    })
})
const getAnother=async (row)=>{
        //const  appData = []
        return  mysqlConnection.query('Select * from question_choices where question_id=' + row.id,async (err,rows, fields ) => {
            var abc = JSON.parse(JSON.stringify(rows))
            console.log("2nd rows", rows)
            //var json = {}
            //var abc = JSON.stringify(rows)
            //console.log(fields)
            return abc
        })
}
module.exports = router