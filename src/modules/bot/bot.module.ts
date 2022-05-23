import {CacheModule, Module} from "@nestjs/common";
import {BotService} from './bll/bot.service';
import {BotController} from './controller/bot.controller';
import {cacheConfig} from "../../config/cache.config"
import {MailModule} from "../mail/mail.module"

@Module({
    imports: [
        CacheModule.registerAsync(cacheConfig),
        MailModule
    ],
    providers: [BotService],
    controllers: [BotController],
    exports: [BotService]
})
export class BotModule {
}
