import {ConfigModule, ConfigService} from '@nestjs/config';

export const mailConfig = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService): Promise<any> =>
        MailConfig.getConfig(configService),
    inject: [ConfigService]
};

class MailConfig {

    static getConfig(configService: ConfigService) {
        return {
            transport: {
                host: configService.get<string>('mail.transport.host'),
                port: configService.get<number>('mail.transport.port'),
                auth: {
                    user: configService.get<string>('mail.transport.auth.user'),
                    pass: configService.get<string>('mail.transport.auth.pass')
                }
            },
            defaults: {
                from: configService.get<string>('mail.defaults.from'),
            },
        }
    }
}
