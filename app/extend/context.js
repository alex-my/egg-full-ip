'use strict';

module.exports = {
    getFullIPRedis() {
        const {
            redisName
        } = this.app.config.fullIP;
        const redis = redisName ? this.app.redis.get(redisName) : this.app.redis;
        return redis;
    },

    _addIP(redis, key, expire) {
        const {
            redisTTL
        } = this.app.config.fullIP;

        if (expire !== undefined && expire <= 0 && expire !== -1) {
            return;
        }

        if (expire === undefined) {
            if (redisTTL === -1) {
                redis.set(key, 1);
            } else {
                redis.setex(key, redisTTL, 1);
            }
        } else if (expire === -1) {
            redis.set(key, 1);
        } else {
            redis.setex(key, expire, 1);
        }
    },

    /**
     * 添加 IP 到缓存中
     * @param {Array<string>} ips 待添加的IP集合，例如 ['192.168.1.5', '192.168.1.12']
     * @param {number} expire 超时时间，单位: 秒，未填写则使用配置中的 redisTTL
     */
    addIPs(ips, expire) {
        const newIPs = [];
        for (let i = 0; i < ips.length; i++) {
            newIPs.push(ips[i], expire);
        }
        this.addIPsExpire(newIPs);
    },

    /**
     * 添加 IP 到缓存中，如果 expire 为 undefined，则使用配置中的 redisTTL
     * @param {Array<string, number>} ips [[ip, expire], ...]，例如: [['192.168.1.12', 235]]
     */
    addIPsExpire(ips) {
        const {
            whiteOnly,
            redisPrefix,
        } = this.app.config.fullIP;
        const redis = this.getFullIPRedis();
        const typeField = whiteOnly ? 'w' : 'b';
        const prefix = `${redisPrefix}:${typeField}`;

        if (ips.length < 5) {
            for (let i = 0; i < ips.length; i++) {
                const [ip, expire] = ips[i];
                const key = `${prefix}:${ip}`;
                this._addIP(redis, key, expire);
            }
        } else {
            const pipeline = redis.pipeline();
            for (let i = 0; i < ips.length; i++) {
                const [ip, expire] = ips[i];
                const key = `${prefix}:${ip}`;
                this._addIP(pipeline, key, expire);
            }
            pipeline.exec();
        }
    },

    /**
     * 添加 IP 到缓存中
     * @param {string} ip 
     * @param {number} expire 超时时间，单位: 秒，未填写则使用配置中的 redisTTL
     */
    addIP(ip, expire) {
        const {
            whiteOnly,
            redisPrefix,
        } = this.app.config.fullIP;
        const redis = this.getFullIPRedis();
        const typeField = whiteOnly ? 'w' : 'b';
        const key = `${redisPrefix}:${typeField}:${ip}`;
        this._addIP(redis, key, expire);
    },

    /**
     * 将 IP 从缓存中删除
     * @param {string} ip 
     */
    delIP(ip) {
        const {
            whiteOnly,
            redisPrefix,
        } = this.app.config.fullIP;
        const redis = this.getFullIPRedis();
        const typeField = whiteOnly ? 'w' : 'b';
        const key = `${redisPrefix}:${typeField}:${ip}`;
        redis.del(key);
    },
};