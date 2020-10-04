const express = require("express")
const  bodyParser = require("body-parser");
const mysqlConnection = require("./connection")
const peopleRoutes = require("./routes/people")
const booksRouter = require("./routes/books")
const flash = require('express-flash');
var session = require('express-session');
var path = require('path');


var app = express();
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

app.use("/questions", peopleRoutes)
app.use('/question_ui', booksRouter);


app.listen(3000)