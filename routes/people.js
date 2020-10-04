const express = require("express")
const router = express.Router()
const mysqlConnection = require("../connection")
var async = require('async');

router.get("/", async (req, res) =>{

    var amount = req.query.amount
    //var phone = req.query.b

   /// console.log(username)
   // console.log(phone)

    var jsonArr = []
    const promises = []

    var output = [];
    mysqlConnection.query('SELECT * FROM question LIMIT ' + amount ,function(error,results,filelds){
        if(error) throw err;

        async.eachSeries(results,function(data,callback){ // It will be executed one by one
            //Here it will be wait query execute. It will work like synchronous
            mysqlConnection.query('SELECT * FROM question_choices  where question_id = ' + data.id,function(error,results1,filelds){
                if(error) throw err;

                var json = {}
                json['question'] = data.question
                json['difficulty'] = data.difficulty
                json['category'] = data.category
                var json2 = {}
                for(var i = 0; i < results1.length; i++){
                    if(results1[i].is_right_choice == 1){
                        json['correct_answer'] = results1[i].choice
                    }else{
                        json2['option'+i] = results1[i].choice
                    }
                }

                json['incorrect_answers'] = json2

                output.push(json)

                callback();
            });

        }, function(err, results) {
            console.log(output); // Output will the value that you have inserted in array, once for loop completed ex . 1,2,3,4,5,6,7,8,9
            res.send(output)
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