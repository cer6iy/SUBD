var mysql = require('lib/mysql');


var getOffers = function (type, next) {
    var query = "SELECT immovables.building, immovables.housing, immovables.number, immovables_types.type_name, offers.summ, offers.period, streets.name ";
    query += "FROM (offers INNER JOIN (immovables INNER JOIN immovables_types ON immovables.type = immovables_types.t_id) ON offers.immovable = immovables.i_id) INNER JOIN streets ON immovables.street = streets.s_id ";
    query += "WHERE immovables.type="+type+";";
    mysql.query(query, function (err, rows, fields) {
        if (!err) {
            return next(rows);
        } else {
            return next(null);
        }
    });
}

module.exports.GetOffers = getOffers