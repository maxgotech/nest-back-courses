import {Controller, Body, Post } from '@nestjs/common';
import { UserService } from '../service/user-services.service';
import { UserDto } from '../dto/user.dto';
import { CreateUserFolderDto } from '../dto/user-folder.dto';

@Controller('user')
export class UserController { 
    constructor(private readonly userService: UserService) {
        
    }
    @Post('data')
    public async login(@Body() UserDto: UserDto): Promise<UserDto> {
        return await this.userService.UserDatabyMail(UserDto);  
    }

    @Post('userfolder')
    public async userFolder(@Body() createUserFolder:CreateUserFolderDto) {
        return await this.userService.createUserFolder(createUserFolder);  
    }
}
