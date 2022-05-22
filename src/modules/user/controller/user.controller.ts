import {Body, Controller, Post} from "@nestjs/common";
import {UserService} from "../bll/user.service";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }



}
