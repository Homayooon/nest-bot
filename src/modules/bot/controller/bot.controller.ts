import {Body, Controller, HttpException, HttpStatus, Post, Req, UseGuards} from "@nestjs/common";
import {BotService} from "../bll/bot.service";
import {ConnectDto, SignUpDto} from "./input-validation"
import {User} from "../dto/bot.dto"
import {AuthLocalGuard} from "../../auth-local/guard/auth-local.guard"
import {AuthenticatedLocalGuard} from "../../auth-local/guard/authenticated-local.guard"
import {MailService} from "../../mail/mail.service"

@Controller('bot')
export class BotController {
    constructor(
        private readonly botService: BotService,
        private readonly mailService: MailService) {
    }

    @Post('sign-up')
    async signUp(@Body() input: SignUpDto) {
        // check user exists or not
        let user: User = await this.botService.getUser('email', input.email)
        if (user) {
            throw new HttpException({
                state: 1,
                msg: 'user already exist',
            }, HttpStatus.OK);
        }
        user = await this.botService.signUp(input.email)
        await this.mailService.sendUserConfirmation(user.email, user.signUpCode)
        throw new HttpException({
            state: 0,
            msg: 'code sent to your email',
            // code: code
        }, HttpStatus.OK);
    }

    @Post('connect')
    @UseGuards(AuthLocalGuard)
    async connect(@Req() req, @Body() input: ConnectDto) {
        throw new HttpException({
            state: 1,
            msg: 'user connected',
            data: req.user
        }, HttpStatus.OK);
    }

    @Post('get-menu')
    @UseGuards(AuthenticatedLocalGuard)
    async getMenu(@Req() req) {
        throw new HttpException({
            state: 1,
            msg: 'menu list info',
            data: this.botService.getMenu()
        }, HttpStatus.OK);
    }

    @Post('test')
    async test(@Req() req) {
       return 'test'
    }

}
