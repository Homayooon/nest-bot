import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-local';
import {AuthLocalService} from '../auth-local.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private authLocalService: AuthLocalService) {
        super({
            usernameField: 'code',
            passwordField: 'code' ,
        }); //config passport local strategy based on passport docs
    }

    /**
     * Validate user credential for connect
     * @return state: null → UnauthorizedException | state: 0 → request.user
     */
    async validate(code = null, password = null): Promise<any> {
        const validationResult = await this.authLocalService.validateUser(code);
        if (validationResult.state !== 0) {
            throw new UnauthorizedException();
        }
        // ** important: if validate be succeeded then by RETURN, we set ANY_DATA in req.user
        return {
            ...validationResult.data,
        };
    }
}
