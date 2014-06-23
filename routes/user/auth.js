var User = require('models/user').User,
    RegToken = require('models/user').RegToken,
    log = require('lib/log')(module);

/*
 ** Sign in/out & sign up or restore user password.
 */

var signIn = function (req, res) {
    var login = req.body.username,
        pass = req.body.password;

    User.findOne({mail: login}, function (err, user) {

        /*TODO: add "remember me" function*/
        /*TODO: e-mail validation*/

        if (login && pass) {
            if (user && user.auth(pass)) {
                req.session.user_id = user.id;
                res.end('1');
            } else {
                res.end('0');

            }
        } else {
            res.end('0');
        }
    });

}

var signOutPost = function (req, res) {
    if (req.session) {
        req.session.destroy(function () {
        });
    }
    res.end("1");
}

var signOutGet = function (req, res) {
    if (req.session) {
        req.session.destroy(function () {
        });
    }
    res.redirect('/');
}

var signUp = function (req, res) {
    var mail = req.body.mail;

    /*TODO: e-mail validation*/

    User.findOne({mail: mail}, function (err, u) {
        if (!err && !u) {
            var regToken = new RegToken({
                mail: mail
            });

            regToken.save(function (err, t, affected) {

                if (!err) {
                    /*TODO: send token to e-mail*/
                    res.end(t.token);
                } else {
                    res.end("0");
                }
            })
        } else {
            res.end("0");
        }
    })


}

var showToken = function (req, res) {
    /*TODO: replace by sending e-mail*/
    var currentToken = req.params.token;
    if (currentToken) {
        res.render('confirm', {token: currentToken});
    }
}

var confirmEmail = function (req, res, next) {
    var currentToken = req.params.token;

    if (currentToken) {
        RegToken.findOne({token: currentToken}, function (err, t) {
            if (!err && t) {
                res.render('create', { token: t.token });
            } else {
                throw new Error();
                next(err);
                res.end("Token not found..");
            }
        })
    }
}

var createUser = function (req, res) {

    /*TODO: fields validation*/

    var firstName = req.body.firstName,
        lastName = req.body.lastName,
        pass = req.body.password,
        currentToken = req.body.token,
        email;
    log.info("Creating started..");

    RegToken.findOne({token: currentToken}, function (err, t) {

        log.info("Token found..");

        if (!err && t) {
            email = t.email;

            User.findOne({mail: email}, function (err, u) {
                if (!err && !u) {
                    RegToken.remove({token: currentToken}, function () {
                        log.info("Token deleting..");
                        var newUser = new User({
                            name: firstName,
                            surname: lastName,
                            password: pass,
                            mail: email
                        });

                        newUser.save(function (err, u, affected) {
                            if (!err && u) {
                                res.end("1");
                            } else {
                                res.end("0");
                            }
                        })
                    });
                } else {
                    log.error("User is alredy registered..");
                    res.end("0");
                }
            })


        } else {
            log.error("Token not found..");
            res.end("0");
        }
    })
}

/*
 ** check user
 */
var loadUser = function (req, next) {
    if (req.user) {
        next(req.user)
    } else {
        var id = req.session.user_id;
        if (id) {
            User.findById(id, function (err, user) {
                if (!err && user) {
                    var userData = {
                        id: user._id,
                        firstName: user.name,
                        lastName: user.surname,
                        account: user.account,
                        events: user.events,
                        isAdmin: user.isAdmin(),
                        isFAdmin: (user.role === "fadmin")
                    };
                    next(userData);
                } else {
                    next(null);
                }
            });
        } else {
            next(null);
        }
    }
}

/*
 ** check access
 */
var restrictAccess = function (req, res, next) {
    loadUser(req, function (user) {
        if (user) {
            req.currentUser = user;
            return next();
        } else {
            if (req.method === "GET") {
                res.redirect('/');
            } else {
                res.send({status: 403})
            }
        }
    });
}

var authedUser = function (req, res, next) {
    loadUser(req, function (user) {
        if (user) {
            if (req.method === "GET") {
                res.redirect('/user');
            } else {
                res.send({status: 1})
            }
        } else {
            next();
        }
    });
}

var adminAccess = function (req, res, next) {
    restrictAccess(req, res, function () {
        if (req.currentUser.isAdmin) {
            return next();
        } else {
            if (req.method === "GET") {
                res.redirect('/user');
            } else {
                res.send({status: 0})
            }
        }
    });
}

var fundAdminAccess = function (req, res, next) {
    restrictAccess(req, res, function () {
        if (req.currentUser.isFAdmin ||req.currentUser.isAdmin) {
            return next();
        } else {
            if (req.method === "GET") {
                res.redirect('/user');
            } else {
                res.send({status: 403})
            }
        }
    });
}


var passportLogin = function (req, res) {
    var redirectTo = req.isAuthenticated() ? "/" : '/user'
    res.redirect(redirectTo)
}
var restorePasswordRender;
/*TODO: it*/

module.exports.RestorePasswRender = restorePasswordRender;
/*Local custom strategy*/
module.exports.SignIn = signIn;
module.exports.SignOutPost = signOutPost;
module.exports.SignOutGet = signOutGet;
module.exports.SignUp = signUp;
module.exports.CreateUser = createUser;
module.exports.ShowToken = showToken;
/*TODO: send by e-mail*/
module.exports.ConfirmMail = confirmEmail;
/*Passport strategies*/
module.exports.AuthCallback = passportLogin;

module.exports.LoadUser = loadUser;
module.exports.RestrictAccess = restrictAccess;
module.exports.AuthedUser = authedUser;
module.exports.AdminAccess = adminAccess;
module.exports.FundAdminAccess = fundAdminAccess;

