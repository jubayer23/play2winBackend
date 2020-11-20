const express = require("express")
const  bodyParser = require("body-parser");
const mysqlConnection = require("./connection")
const apiRouters = require("./routes/api_router")
const crudUiRouter = require("./routes/question_ui_router")
//const ngrok = require('ngrok');
const flash = require('express-flash');
var session = require('express-session');
var path = require('path');

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(session({
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use("/questions", apiRouters)
app.use('/question_ui', crudUiRouter);

var PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log('Running at ',PORT);
});
/*
ngrok.connect({
    proto : 'http',
    addr : process.env.PORT,
}, (err, url) => {
    if (err) {
        console.error('Error while connecting Ngrok',err);
        return new Error('Ngrok Failed');
    }
});
*/
console.log('Final');
//app.listen(3000)