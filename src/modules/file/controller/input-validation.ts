import { IsDefined, IsString } from 'class-validator';

export class FileDownloadDto {
  @IsString()
  fileId: string
}
