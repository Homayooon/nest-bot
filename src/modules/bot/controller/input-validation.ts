import {IsDefined, IsEmail, IsNumber, Length, MinLength} from 'class-validator';


// Route: /bot/sign-up | BotCtrl.singUp
export class SignUpDto {

    @IsDefined()
    @IsEmail()
    email: string;
}

// Route: /bot/connect | BotCtrl.connect
export class ConnectDto {
    @IsNumber()
    code: number;
}

