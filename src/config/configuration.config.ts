export default () => ({
    httpHost: 'localhost',
    httpPort: process.env.HTTP_PORT || 3000,
    session: {
        secret: 'this_should_be_a_strong_value',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 2 * 24 * 60 * 60 * 1000 // 2 Days
        },
    },
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    },
    cache: {
        defaultCacheTtl: 3600 // 3600 = 60 min
    },
    mail: {
        transport: {
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "081ff803482943",
                pass: "0a4ddc0362016b"
            }
        },
        defaults: {
            from: '"No Reply" <noreply@example.com>',
        },
    }
});
