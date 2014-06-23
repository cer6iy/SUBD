/*
 ** User's and associated models
 */

var crypto = require('crypto');
var mongoose = require('lib/mongoose');

Schema = mongoose.Schema;

/* ======= Schemas ======= */

/*User schema*/
var user = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String
    },
    birth: {
        type: Date
    },
    mail: {
        type: String,
        unique: true
    },
    hashedPassword: {
        type: String
    },
    salt: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    contacts: [
        {
            contactType: {
                type: String,
                required: true,
                default: "Телефон"
            },
            contact: {
                type: String,
                required: true
            }
        }
    ]
});

/* ======= Methods ======= */

/*Virtuals*/
user.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = Math.round((new Date().valueOf() * Math.random())) + '';
        this.hashedPassword = this.encryptPassword(password)
    })
    .get(function () {
        return this._password;
    })

/*Methods*/
user.path('role')
    .set(function (r) {
        switch (r) {
            case "admin":
                this.role = "admin";
                break;
            case "manager":
                this.role = "manager";
                break;
            case "realtor":
                this.role = "realtor";
                break;
            default:
                this.role = "user";
        }
    });
user.methods.isAdmin = function () {
    return this.role === "admin";
}
user.methods.isManager = function () {
    return this.role === "manager";
}
user.methods.isRealtor = function () {
    return this.role === "realtor";
}

user.methods.auth = function (pass) {
    return this.hashedPassword === this.encryptPassword(pass);
}

user.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
}

/*SignUp model*/

var regToken = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    }
});
regToken.virtual('mail')
    .set(function (mail) {
        this.email = mail;
        this.token = crypto.createHmac('sha1', Math.round((new Date().valueOf() * Math.random())) + '').digest('hex');
    })
    .get(function(){
        return this.email;
    })


module.exports.User = mongoose.model('User', user);
module.exports.RegToken = mongoose.model('RegToken', regToken);