'use strict';

exports.fullIP = {
    // true: 开启白名单，而黑名单会失效
    whiteOnly: false,
    // 当使用内置的判断黑白名单时，需要配置 redis
    redisName: null,
    // redis 键前缀，根据 whiteOnly 会在前缀尾部自行添加 ':w' 和 ':b'
    redisPrefix: 'full:ip',
    // redis 缓存时间，单位: 秒， -1 表示永久
    redisTTL: -1,

    // 无法通过判断时，跳转地址(优先极高)
    redirectUrl: null,
    // 无法通过判断时，返回值
    code: 403,
    message: 'REQUEST DISABLED',
};