import {Module} from '@nestjs/common';
import {LocalStrategy} from './bll/strategies/local.strategy';
import {PassportModule} from '@nestjs/passport';
import {AuthLocalService} from "./bll/auth-local.service"
import {AuthLocalController} from "./controller/auth-local.controller"
import {SessionSerializer} from "./bll/session.serializer"
import {BotModule} from "../bot/bot.module"


@Module({
    imports: [
        PassportModule.register({session: true}),
        BotModule
    ],
    controllers: [AuthLocalController],
    providers: [AuthLocalService, LocalStrategy, SessionSerializer],
})
export class AuthLocalModule {
}


