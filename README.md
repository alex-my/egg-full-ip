## 说明

- 插件会对`IP`进行判断，不符合判断的请求会优先跳转到`redirectUrl`指向的地址，未设置`redirectUrl`，则返回响应`code`, `message`
- 插件允许开启白名单或者黑名单，只能开启其中一个
- 不在白名单或者在黑名单中的都无法通过判断
- 使用`ctx.addIPs(ips: array<string>)`添加`IP`名单，参数是字符串数组
- 使用`ctx.delIP(ip: string)`移除`IP`名单
- 插件使用`redis`来存储数据，因此需要安装`egg-redis`

## 版本更新

- [CHANGELOG](./CHANGELOG.md)

## 安装

```bash
$ npm install egg-full-ip egg-redis --save
```

## 配置

- 配置`egg-full-ip`

  ```js
  // {app_root}/config/config.default.js
  exports.fullIP = {
    // true: 开启白名单，而黑名单会失效
    whiteOnly: false,
    // 当使用内置的判断黑白名单时，需要配置 redis
    redisName: null,
    // redis 键前缀
    redisPrefix: 'full:ip',
    // redis IP 缓存时间，单位: 秒， -1 表示永久
    redisTTL: -1,

    // 无法通过判断时，跳转地址(优先极高)，如 '/403'
    redirectUrl: null,
    // 无法通过判断时，返回值
    code: 403,
    message: 'REQUEST DISABLED',
  };
  ```

- 配置 `egg-redis`(二选一)

  - 方法一: 没有指定`redisName`，直接使用`app.redis`

    ```js
    // {app_root}/config/config.default.js
    config.redis = {
      client: {
        port: 6379,
        host: '127.0.0.1',
        password: '123456',
        db: 0,
      },
    };
    ```

  - 方法二: 指定`redisName`，例如设置为`fullIP`

    ```js
    // {app_root}/config/config.default.js
    config.redis = {
      clients: {
        fullIP: {
          port: 6379,
          host: '127.0.0.1',
          password: '123456',
          db: 0,
        },
      },
    };
    ```

## 使用

- 配置插件

  ```js
  // config/plugin.js
  exports.fullIP = {
    enable: true,
    package: 'egg-full-ip',
  };

  exports.redis = {
    enable: true,
    package: 'egg-redis',
  };
  ```

- 添加/移除`IP`，函数属于`context`扩展

  - 添加`IP`: `addIPs(ips: array<string>)`

    ```js
    ctx.addIPs(['192.168.1.5', '192.168.1.12']);
    ```

  - 移除`IP`: `delIP(ip: string)`

    ```js
    ctx.delIP('192.168.1.5');
    ```

## License

[MIT](LICENSE)
