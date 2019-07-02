'use strict';

const assert = require('assert');

module.exports = (options, app) => {
    const {
        whiteOnly,
        redisName,
        redisPrefix,
        redirectUrl,
        code,
        message
    } = app.config.fullIP;

    const redis = redisName ? app.redis.get(redisName) : app.redis;
    assert((redis !== undefined && redis !== null), "Please configure redis");
    const typeField = whiteOnly ? 'w' : 'b';
    const prefix = `${redisPrefix}:${typeField}`;

    // 判断 ip 是否在 IP 中
    const checkIP = async (ip) => {
        const key = `${prefix}:${ip}`;
        const isExist = await redis.get(key);
        return isExist !== null;
    }

    const output = async (ctx) => {
        if (redirectUrl) {
            await ctx.redirect(redirectUrl);
        } else {
            ctx.status = code;
            ctx.body = message;
        }
    }

    return async function fullCheckIP(ctx, next) {
        if (redirectUrl && ctx.path === redirectUrl) {
            await next();
            return;
        }

        const isExist = await checkIP(ctx.ip);
        // 白名单
        if (whiteOnly) {
            if (isExist) {
                await next();
            } else {
                output(ctx);
            }
        } else {
            // 黑名单
            if (isExist) {
                output(ctx);
            } else {
                await next();
            }
        }
    }
}