'use strict';

module.exports = (mongoose) => {
    [
        "./account",
        './permission',
        './role'
    ].forEach((file) => {
        require(file)(mongoose);
    });
}