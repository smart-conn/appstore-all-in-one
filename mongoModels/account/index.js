'use strict';

module.exports = (mongoose) => {
    [
        "./account"
    ].forEach((file) => {
        require(file)(mongoose);
    });
}