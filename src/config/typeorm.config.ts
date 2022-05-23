import {TypeOrmModuleAsyncOptions, TypeOrmModuleOptions} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {File} from '../db/typeorm-models/file.entity'

export const postgresTypeOrmConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> =>
        PostgresTypeOrmConfig.getConfig(configService),
    inject: [ConfigService]
}

class PostgresTypeOrmConfig {

    static getConfig(configService: ConfigService): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: configService.get<string>('postgresTypeOrm.host'),
            port: configService.get<number>('postgresTypeOrm.port'),
            username: configService.get<string>('postgresTypeOrm.username'),
            password: configService.get<string>('postgresTypeOrm.password'),
            database: configService.get<string>('postgresTypeOrm.database'),
            synchronize: configService.get<boolean>('postgresTypeOrm.synchronize'),
            entities: [
                File
            ],
        }
    }
}

