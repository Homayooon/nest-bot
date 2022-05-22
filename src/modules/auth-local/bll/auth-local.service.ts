import {Injectable} from '@nestjs/common';
import {BllResult} from "../../../global-dto/global-dto";
import {BotService} from "../../bot/bll/bot.service"

@Injectable()
export class AuthLocalService {
    constructor(
        private botService: BotService
    ) {
    }

    /**
     * Validate a user
     * @return state: 0 → user credential is valid | state: 1 → username is Not valid | state: 2 → password is Not valid
     */
    async validateUser(code: number): Promise<BllResult> {
        try {
            const user = await this.botService.connectUser(code)
            if (!user) return {
                state: 1,
                msg: 'invalid user'
            }

            return {
                state: 0,
                msg: 'user information',
                data: user,
            };
        } catch (error) {
            throw error
        }
    }


}
