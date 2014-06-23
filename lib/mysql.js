var mysql = require('mysql'),
    log = require('lib/log')(module),
    conf = require('config');
var connection = mysql.createConnection({
    host     : conf.get('mysql:host'),
    user     : conf.get('mysql:user'),
    password : conf.get('mysql:password'),
    database : conf.get('mysql:db')
});

connection.connect(function(err){
    if (err){
        log.error("MySQL connection error");
    }
});

module.exports = connection;

