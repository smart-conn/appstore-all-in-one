'use strict';
module.exports = (mongoose) => {
    const Schema = mongoose.Schema;

    return mongoose.model("permission", new Schema({
        name: String
    }));
}