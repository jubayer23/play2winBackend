const express = require("express")
const router = express.Router()
const mysqlConnection = require("../connection")
var async = require('async');
const mysql = require("mysql");

// display crud_ui page
router.get('/', function(req, res, next) {

    var output = [];
    mysqlConnection.query('SELECT * FROM question',function(error,results,filelds){
        //if(error) throw err;
        if(error) {
            req.flash('error', err);
            // render to views/crud_ui/index.ejs
            res.render('crud_ui',{data:''});
        }

        async.eachSeries(results,function(data,callback){ // It will be executed one by one
            //Here it will be wait query execute. It will work like synchronous
            mysqlConnection.query('SELECT * FROM question_choices  where question_id = ' + data.id,function(error,results1,filelds){
               // if(error) throw err;
                if(error) {
                    req.flash('error', err);
                    // render to views/crud_ui/index.ejs
                    res.render('crud_ui',{data:''});
                }

                var json = {}
                json['id'] = data.id
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
            res.render('crud_ui',{data:output});
            //console.log(output); // Output will the value that you have inserted in array, once for loop completed ex . 1,2,3,4,5,6,7,8,9
            //res.send(output)
        });
    })


})

// display add question page
router.get('/add', function(req, res, next) {
    // render to add.ejs
    res.render('crud_ui/add', {
        question: '',
        category: '',
        difficulty: '',
        correct: '',
        option1: '',
        option2: '',
        option3: ''
    })
})


// add a new question
router.post('/add', function(req, res, next) {

    let question = req.body.question;
    let category = req.body.category;
    let difficulty = req.body.difficulty;
    let correct = req.body.correct;
    let option1 = req.body.option1;
    let option2 = req.body.option2;
    let option3 = req.body.option3;
    let errors = false;

    if(question.length === 0 || category.length === 0 || difficulty.length === 0 || correct.length === 0
    || option1.length === 0 || option2.length === 0 || option3.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter all details");
        // render to add.ejs with flash message
        res.render('crud_ui/add', {
            question: question,
            category: category,
            difficulty: difficulty,
            correct: correct,
            option1: option1,
            option2: option2,
            option3: option3
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            question: question,
            category: category,
            difficulty: difficulty
        }

        // insert query
        mysqlConnection.query('INSERT INTO question SET ?', form_data, function(err, result) {
            //if(err) throw err
            console.log(result)
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('crud_ui/add', {
                    question: form_data.question,
                    category: form_data.category,
                    difficulty: form_data.difficulty
                })
            } else {

                var values1 = [
                    [correct, true, result.insertId],
                    [option1, false, result.insertId],
                    [option2, false, result.insertId],
                    [option3, false, result.insertId]
                ];

                mysqlConnection.query('INSERT INTO question_choices (choice, is_right_choice, question_id) VALUES ?', [values1], function(err, result) {
                    if(!err){
                        //console.log('id', result)
                        req.flash('success', 'Question successfully added');
                        res.redirect('/question_ui/add');
                    }else{
                        req.flash('error', err)
                    }
                })


            }
        })
    }
})

// display edit question page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;

    mysqlConnection.query('SELECT * FROM question WHERE id = ' + id, function(err, rows, fields) {
        //if(err) throw err

       // console.log("row", rows)
        // if user not found
        if (rows.length <= 0 || err) {
            req.flash('error', 'Question not found with id = ' + id)
            res.redirect('/question_ui')
        }
        // if question found
        else {
            mysqlConnection.query('SELECT * FROM question_choices  where question_id = ' + id,function(error,sub_rows,filelds){

                if(sub_rows.length >= 3 && !error){
                    var json = {}
                    json['id'] = id
                    json['question'] = rows[0].question
                    json['difficulty'] = rows[0].difficulty
                    json['category'] = rows[0].category
                    var json2 = {}
                    for(var i = 0; i < sub_rows.length; i++){
                        if(sub_rows[i].is_right_choice == 1){
                            json['correct_answer'] = sub_rows[i].choice
                        }else{
                            json2['option'+i] = sub_rows[i].choice
                        }
                    }

                    json['incorrect_answers'] = json2
                    res.render('crud_ui/edit',{data:json});
                }else{
                    req.flash('error', 'Question not found with id = ' + id)
                    res.redirect('/question_ui')
                }


            })


        }
    })
})


// update question data
router.post('/update/(:id)', function(req, res, next) {

    let id = req.params.id;
    let question = req.body.question;
    let category = req.body.category;
    let difficulty = req.body.difficulty;
    let correct = req.body.correct;
    let option1 = req.body.option1;
    let option2 = req.body.option2;
    let option3 = req.body.option3;
    let errors = false;

    if(question.length === 0 || category.length === 0 || difficulty.length === 0 || correct.length === 0
        || option1.length === 0 || option2.length === 0 || option3.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter all details");
        // render to add.ejs with flash message
        res.render('crud_ui/edit', {
            id: id,
            question: question,
            category: category,
            difficulty: difficulty,
            correct: correct,
            option1: option1,
            option2: option2,
            option3: option3
        })
    }

    // if no error
    if( !errors ) {

        var form_data = {
            question: question,
            category: category,
            difficulty: difficulty
        }
        // update query
        mysqlConnection.query('UPDATE question SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('crud_ui/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    author: form_data.author
                })
            } else {


                mysqlConnection.query('SELECT * FROM question_choices  where question_id = ' + id,function(error,sub_rows,filelds){

                    if(!error){

                        var queries = ''

                        for(var i = 0, j =0; i < sub_rows.length; i++){
                            if(sub_rows[i].is_right_choice == 1){
                                queries += mysql.format("UPDATE question_choices SET choice = ? WHERE id =  " + sub_rows[i].id + ";", correct)
                            }else{
                                if(j == 0){
                                    j++
                                    queries += mysql.format("UPDATE question_choices SET choice = ? WHERE id =  " + sub_rows[i].id + ";", option1)
                                }else if(j == 1){
                                    j++
                                    queries += mysql.format("UPDATE question_choices SET choice = ? WHERE id =  " + sub_rows[i].id + ";", option2)
                                }else if(j == 2){
                                    j++
                                    queries += mysql.format("UPDATE question_choices SET choice = ? WHERE id =  " + sub_rows[i].id + ";", option3)
                                }
                            }
                        }
                        //console.log("query", queries)
                        mysqlConnection.query(queries, (err, result) =>{
                            if(!err){
                                req.flash('success', 'Question successfully updated');
                                res.redirect('/question_ui');
                            }else{
                                console.log("error", err)
                            }
                        });

                    }

                })

            }
        })
    }


})


// delete question
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;

    mysqlConnection.query('DELETE FROM question WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/question_ui')
        } else {

            mysqlConnection.query('DELETE FROM question_choices WHERE question_id = ' + id, function(err, result) {
                // set flash message
                req.flash('success', 'Question successfully deleted! ID = ' + id)
                // redirect to books page
                res.redirect('/question_ui')
            })

        }
    })
})

module.exports = router
