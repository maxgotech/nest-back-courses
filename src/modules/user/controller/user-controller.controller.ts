import {Controller, Body, Post } from '@nestjs/common';
import { UserService } from '../service/user-services.service';
import { UserDto } from '../dto/user.dto';

@Controller('user')
export class UserController { 
    constructor(private readonly userService: UserService) {
        
    }
    @Post('Data')
    public async login(@Body() UserDto: UserDto): Promise<UserDto> {
        return await this.userService.UserDatabyMail(UserDto);  
    }
}
