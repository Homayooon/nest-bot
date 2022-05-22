import {Inject, MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {AppController} from "./app.controller";
import {UserModule} from "./modules/user/user.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import configuration from './config/configuration.config';
import {REDIS, RedisModule} from "./modules/redis"
import {RedisClient} from 'redis';
import * as RedisStore from 'connect-redis';
import * as session from 'express-session'
import * as passport from "passport"
import {AuthLocalModule} from "./modules/auth-local/auth-local.module"
import {BotModule} from "./modules/bot/bot.module"

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            envFilePath: ['.env'],
        }),
        RedisModule,
        AuthLocalModule,
        UserModule,
        BotModule
    ],
    controllers: [AppController],
    providers: []
})
export class AppModule implements NestModule {
    constructor(
        @Inject(REDIS) private readonly redis: RedisClient,
        private configService: ConfigService) {
    }

    configure(consumer: MiddlewareConsumer) {

        //region Express Session
        consumer.apply(
            session({
                store: new (RedisStore(session))({client: this.redis, logErrors: true}),
                secret: this.configService.get<string>('session.secret'),
                resave: this.configService.get<boolean>('session.resave'),
                saveUninitialized: this.configService.get<boolean>('session.saveUninitialized'),
                cookie: {
                    maxAge: this.configService.get<number>('session.cookie.maxAge')
                },
            }),
            passport.initialize(),
            passport.session()
        ).forRoutes('*')
        //endregion

    }
}
