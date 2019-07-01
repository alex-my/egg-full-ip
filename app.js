'use strict';

const assert = require('assert');

const MIDDLEWARE_FULL_IP = 'fullCheckIP';

module.exports = app => {
    const name = MIDDLEWARE_FULL_IP;
    const index = app.config.coreMiddleware.indexOf(name);
    assert.equal(
        index,
        -1,
        `Duplication of middleware name found: ${name}. Rename your middleware other than "${name}" please.`
    );

    app.config.coreMiddleware.unshift(MIDDLEWARE_FULL_IP);
};