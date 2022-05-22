import {CACHE_MANAGER, Inject, Injectable} from "@nestjs/common";
import {Cache} from 'cache-manager'
import {User} from "../dto/bot.dto"
import {ConfigService} from "@nestjs/config"

@Injectable()
export class BotService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private configService: ConfigService
    ) {
    }

    userCacheTtl: number = this.configService.get<number>('cache.defaultCacheTtl')
    usersCacheKey = 'users'

    getMenu() {
        return [
            'Menu 1', 'Menu 2', 'Menu 3'
        ]
    }

    async connectUser(code: number) : Promise<User | null>{
        const user = await this.getUser('code', code)
        if (!user) return null
        return user
    }

    async signUp(email: string): Promise<User> {
        const code = this.generate6DigitCode()

        const user: User = {email, signUpCode: code}
        let users: User[] = await this.getAllUsers()
        if (!users) users = []
        users.push(user)
        // save email and code on cache
        await this.cacheManager.set(this.usersCacheKey, users, {ttl: this.userCacheTtl})
        return user
    }

    async getUser(filter: 'email' | 'code', value: string | number): Promise<User | null> {
        const users: User[] = await this.cacheManager.get(this.usersCacheKey)
        if (!users) return null
        if (filter === 'email')
            return users.find(user => user.email === value)
        if (filter === 'code')
            return users.find(user => user.signUpCode === value)
    }

    async getAllUsers(): Promise<User[] | null> {
        return await this.cacheManager.get(this.usersCacheKey)
    }

    generate6DigitCode() {
        return Math.floor(100000 + Math.random() * 900000)
    }

}

