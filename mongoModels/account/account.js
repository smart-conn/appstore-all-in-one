'use strict';
module.exports = (mongoose) => {
    const Schema = mongoose.Schema;

    return mongoose.model("account", new Schema({
        name: String, //登录名
        pwd: String,
        salt: String
    }));
}