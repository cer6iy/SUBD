var User = require('models/user').User;
var rielt = require('routes/rielt');
/*
 * GET user pages.
 */

exports.Index = function (req, res) {
    var type = "2";
    rielt.GetOffers(type, function(offers){
        if (offers) {
            res.render('user', {data: { user: req.currentUser, offers: offers}});
            console.log('Объекты для сдачи: ', offers);
        } else {
            res.render('user', {data: { user: req.currentUser}});
        }
    })

    /*var query = "SELECT immovables.building, immovables.housing, immovables.number, immovables_types.type_name, offers.summ, offers.period, streets.name ";
    query += "FROM (offers INNER JOIN (immovables INNER JOIN immovables_types ON immovables.type = immovables_types.t_id) ON offers.immovable = immovables.i_id) INNER JOIN streets ON immovables.street = streets.s_id;";
    mysql.query(query, function (err, rows, fields) {
        if (!err) {
            res.render('user', {data: { user: req.currentUser, offers: rows}});
            console.log('Объекты для сдачи: ', rows);
        } else {
            res.render('user', {data: { user: req.currentUser}});
        }
    });*/
};

module.exports.Settings = function (req, res) {
    res.render('user/setting', {data: { user: req.currentUser }});
};


var fillAccount = function (req, res, next) {
    var id = req.body.user_id,
        summ = req.body.summ;
    console.log(id + "   " + summ)
    User.findById(id, function (err, u) {
        if (!err && u) {
            u.account += parseInt(summ);
            u.save(function (err, u) {
                if (!err) {
                    res.send({status: 1, account: u.account});
                } else {
                    res.send({status: 0})
                }
            })
        } else {
            res.send({status: 0})
        }
    })
}


module.exports.FillAccount = fillAccount;