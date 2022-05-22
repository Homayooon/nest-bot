import {ExecutionContext, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {validate} from 'class-validator';
import {ConnectDto} from "../../bot/controller/input-validation"

@Injectable()
export class AuthLocalGuard extends AuthGuard('local') {

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const validationErrors = await this.validateRequestInput(req.body);
        if (validationErrors.length > 0) {
            throw new HttpException({
                error: 'Bad Request',
                message: validationErrors,
            }, HttpStatus.BAD_REQUEST);
        }
        // if validation be succeeded then AuthLocalGuard will continue the workflow,
        // and it calls LocalStrategy.validate()
        const activate = (await super.canActivate(context)) as boolean;
        // trigger the passport to use the session
        await super.logIn(req)
        return activate
    }

    /**
     * Validate Login Request input
     * @return {array} - Array of errors
     */
    private async validateRequestInput(input: ConnectDto) {
        const connectDto = new ConnectDto();
        connectDto.code = input.code
        return await validate(connectDto, {
            forbidUnknownValues: true,
            validationError: {
                target: false,
            },
        })
    }

}
