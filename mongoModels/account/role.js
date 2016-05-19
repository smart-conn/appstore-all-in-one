'use strict';
module.exports = (mongoose) => {
    const Schema = mongoose.Schema;

    return mongoose.model("role", new Schema({
        name: String,
        permission: [{
            type: Schema.Types.ObjectId, ref: 'permission'
        }]
    }));
}