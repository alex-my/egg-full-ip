'use strict';

module.exports = {
    getFullIPRedis() {
        const {
            redisName
        } = this.app.config.fullIP;
        console.log(`config.fullIP: ${JSON.stringify(this.app.config.fullIP)}`);
        console.log(`redisName: ${redisName}`);
        const redis = redisName ? this.app.redis.get(redisName) : this.app.redis;
        console.log(`redis: ${typeof redis}`);
        return redis;
    },

    /**
     * 添加 IP 到缓存中
     * @param {Array<string>} ips 待添加的IP集合，例如 ['192.168.1.5', '192.168.1.12']
     */
    addIPs(ips) {
        const logger = this.app.coreLogger;
        const {
            redisPrefix,
            redisTTL
        } = this.app.config.fullIP;
        const redis = this.getFullIPRedis();
        if (ips.length < 5) {
            for (let i = 0; i < ips.length; i++) {
                const key = `${redisPrefix}:${ips[i]}`;
                if (redisTTL === -1) {
                    redis.set(key, 1);
                } else {
                    redis.setex(key, redisTTL, 1);
                }
            }
        } else {
            const pipeline = redis.pipeline();
            for (let i = 0; i < ips.length; i++) {
                const key = `${redisPrefix}:${ips[i]}`;
                if (redisTTL === -1) {
                    pipeline.set(key, 1);
                } else {
                    pipeline.setex(key, redisTTL, 1);
                }
            }
            pipeline.exec();
        }
    },

    /**
     * 将 IP 从缓存中删除
     * @param {string} ip 
     */
    async delIP(ip) {
        const {
            redisPrefix,
        } = this.app.config.fullIP;
        const redis = this.getFullIPRedis();
        const key = `${redisPrefix}:${ip}`;
        const result = redis.del(key);
        console.log(`delIP, result: ${result}`);
    },
};