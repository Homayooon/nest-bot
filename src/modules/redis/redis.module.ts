import {Module} from '@nestjs/common';
import {REDIS} from './redis.constants';
import * as Redis from 'redis';
import {ConfigService} from "@nestjs/config"

@Module({
    providers: [
        {
            provide: REDIS,
            useFactory: (configService: ConfigService) => {
                return Redis.createClient({
                    host: configService.get<string>('redis.host'),
                    port: configService.get<number>('redis.port'),
                })
            },
            inject: [ConfigService]
        },
    ],
    exports: [REDIS],
})
export class RedisModule {
}
