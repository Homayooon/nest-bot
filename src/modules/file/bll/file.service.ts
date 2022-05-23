import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import {extname} from 'path';
import {nanoid} from 'nanoid'
import {ConfigService} from '@nestjs/config';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {File, FileStatus} from '../../../db/typeorm-models/file.entity'
import {Cache} from 'cache-manager'
import {BllResult} from 'src/global-dto/global-dto';
import {existsSync, mkdirSync} from "fs"
import * as fs from 'fs';

@Injectable()
export class FileService {
    constructor(
        private configService: ConfigService,
        @InjectRepository(File) private fileRepo: Repository<File>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
    }

    fileCacheTtl: number = 120 // 2 min
    fileCacheKeyPrefix = 'file_'


    async saveFileInfo(file: Express.Multer.File, userId: number): Promise<string> {
        try {
            const fileInfo = new File()
            fileInfo.tempId = nanoid()
            fileInfo.userId = userId
            fileInfo.name = file.filename
            fileInfo.size = file.size
            fileInfo.path = file.path
            fileInfo.status = FileStatus.Temp
            await this.fileRepo.save(fileInfo)
            return fileInfo.tempId
        } catch (error) {
            throw error
        }
    }

    async saveFileInfoOnCache(fileId: string, userId: number): Promise<BllResult> {
        try {
            const fileInfo = await this.fileRepo.findOne({
                where: {
                    tempId: fileId,
                    userId: userId
                }
            })
            if (!fileInfo) {
                return {
                    state: 1,
                    msg: 'file not found'
                }
            }
            const fileKey = this.fileCacheKeyPrefix + fileInfo.tempId
            await this.cacheManager.set(fileKey, fileInfo.path, {ttl: this.fileCacheTtl})
            return {
                state: 0,
                msg: 'file info saved on cache',
            }
        } catch (error) {
            throw error
        }
    }

    async getFileUrlFromCache(fileId: string): Promise<BllResult> {
        try {
            const fileKey = this.fileCacheKeyPrefix + fileId
            const fileUrl = await this.cacheManager.get(fileKey)
            if (!fileUrl) {
                return {
                    state: 1,
                    msg: 'file not found'
                }
            }
            return {
                state: 0,
                msg: 'file url',
                data: fileUrl
            }
        } catch (error) {
            throw error
        }
    }

}

export const customizeUploadedFileName = (req, file, callback) => {

    const fileExtName = extname(file.originalname);
    const customName = nanoid();
    callback(null, `${customName}${fileExtName}`);
};
export const customizeUploadedDirectory = (req, file, callback) => {
    const userId = 101 // get userId from req.user.id
    const baseDir = `./file-storage`
    const userDir = baseDir + `/${userId}`
    if (!existsSync(baseDir)) {
        mkdirSync(baseDir);
        if (!existsSync(userDir)) {
            mkdirSync(userDir);
        }
    }
    callback(null, userDir);
};

