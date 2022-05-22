import {Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards} from '@nestjs/common';
import {AuthLocalGuard} from '../guard/auth-local.guard';
import {AuthenticatedLocalGuard} from "../guard/authenticated-local.guard"
import {AuthLocalService} from "../bll/auth-local.service"

@Controller('auth-local')
export class AuthLocalController {
    constructor(private readonly authService: AuthLocalService) {
    }

    // Route: /auth-local/login | Ctrl.login
    @Post('login')
    @UseGuards(AuthLocalGuard)
    async login(@Req() req) {
        throw new HttpException({
            state: 0,
            msg: 'user information',
            data: {
                user: req.user,
            }
        }, HttpStatus.OK);
    }

    @Post('protected')
    @UseGuards(AuthenticatedLocalGuard)
    protected(@Req() req) {
        // req.user is available
        return req.user
    }

}
