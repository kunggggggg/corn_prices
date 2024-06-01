var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);

//在 express.js 中，使用 sqlite3 來操作數據庫，並開啟位置在 db/sqlite.db 的資歷庫，需要確認是否成功打開資料庫
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/sqlite.db',(err) => {
    if (err) {
        console.error(err.message);
    }
    else {
        console.log('Connect to the database.');
    }
});

db.run('CREATE TABLE IF NOT EXISTS corn_prices (id INTEGER PRIMARY KEY AUTOINCREMENT, year_month VARCHAR(7) NOT NULL, price DECIMAL(10,3) NOT NULL)');

app.get('/api/quotes', (req, res) => {
    db.all('SELECT * FROM corn_prices', (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        res.json(rows);
    });
});

module.exports = app;
