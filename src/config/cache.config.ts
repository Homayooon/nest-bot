import {ConfigModule, ConfigService} from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

export const cacheConfig = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService): Promise<any> =>
        RedisConfig.getConfig(configService),
    inject: [ConfigService]
};

class RedisConfig {

    static getConfig(configService: ConfigService) {
        return {
            store: redisStore,
            host: configService.get<string>('redis.host'),
            port: configService.get<number>('redis.port'),
        }
    }
}
