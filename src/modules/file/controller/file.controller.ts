import {Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {customizeUploadedFileName, FileService, customizeUploadedDirectory} from '../bll/file.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';

import {FileDownloadDto} from './input-validation';
import {ConfigService} from '@nestjs/config';


@Controller('file')
export class FileController {
    constructor(
        private fileService: FileService,
        private configService: ConfigService,
    ) {
    }

    userId = 101 // get userId from req.user.id
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                filename: customizeUploadedFileName,
                destination: customizeUploadedDirectory
            }),
            limits: {
                fileSize: 3145728, // 3145728 Byte(binary) = 3 MB,
            },
        }),
    )
    async upload(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new HttpException({
                state: 1,
                msg: 'file input is empty',
            }, HttpStatus.BAD_REQUEST);
        }

        const result = await this.fileService.saveFileInfo(file, this.userId);

        throw new HttpException({
            state: 0,
            msg: 'file info',
            data: {
                fileId: result,
            }
        }, HttpStatus.OK);
    }


    @Post(`download`)
    async download(@Body() input: FileDownloadDto, @Req() req) {
        const result = await this.fileService.saveFileInfoOnCache(input.fileId, this.userId)
        if (result.state === 1) {
            throw new HttpException({
                state: 1,
                msg: 'file not found',
            }, HttpStatus.NOT_FOUND);
        }
        const hostUrl = this.configService.get<string>('httpHost') + ':' + this.configService.get<number>('httpPort');
        const fileUrl = hostUrl + req.path + `/${input.fileId}`

        if (result.state === 0) {
            throw new HttpException({
                state: 1,
                msg: 'file url',
                data: {fileUrl}
            }, HttpStatus.OK);
        }

    }

    @Get(`download/:fileId`)
    async getFileUrl(@Param('fileId') fileId: string, @Res() response) {

        const result = await this.fileService.getFileUrlFromCache(fileId)
        if (result.state === 1) {
            throw new HttpException({
                state: 1,
                msg: 'file not found',
            }, HttpStatus.NOT_FOUND);
        }
        return response.sendFile(result.data, {root: './'});
    }

    @Get(`test`)
    async test(@Req() req) {
        return req.path
    }

}
