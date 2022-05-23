import {CacheModule, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FileService} from './bll/file.service';
import {FileController} from './controller/file.controller';
import {File} from '../../db/typeorm-models/file.entity'
import { cacheConfig } from 'src/config/cache.config';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            File
        ]),
        CacheModule.registerAsync(cacheConfig),
    ],
    controllers: [FileController],
    providers: [FileService],
    exports: []
})
export class FileModule {
}
