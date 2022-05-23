import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {
    }

    async sendUserConfirmation(email: string, code: number) {

        await this.mailerService.sendMail({
            from: 'Nester-Bot',
            to: email,
            subject: 'Connection code for Nest-Bot',
            html: `<p>Your code is: <b>${code}</b></p>`,
        });
    }
}
