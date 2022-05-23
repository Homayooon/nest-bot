import {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'nest-bot',
    synchronize: false,
    entities: ['src/db/typeorm-models/**/*.entity.ts'],
    migrations: ['dist/src/db/typeorm-migrations/*.js'],
    cli: {
        migrationsDir: 'src/db/typeorm-migrations',
    },
};

export default config;
