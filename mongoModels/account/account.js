'use strict';
module.exports = (mongoose) => {
    const Schema = mongoose.Schema;
    const passportLocalMongoose = require('passport-local-mongoose');
    const Account = new Schema({
        name: String,
        pwd: String,
        salt: String,
        role: [{
            type: Schema.Types.ObjectId, ref: 'role'
        }]
    });
    Account.plugin(passportLocalMongoose, {
        usernameField: 'name',
        saltField: 'salt',
        hashField: 'pwd'
    });
    return mongoose.model("account", Account);
}