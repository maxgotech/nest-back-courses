import { Controller, Body, Post, Get, Param, Res, UseInterceptors, UploadedFile, BadRequestException, Patch, Query } from '@nestjs/common';
import { UserService } from '../service/user-services.service';
import { UserDto } from '../dto/user.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserImageStorage } from 'src/shared/storages';
import { ImageFilter } from 'src/shared/filters';

@Controller('user')
export class UserController { 
    constructor(private readonly userService: UserService) {
        
    }
    
    @Get('data?')
    public async UserData(@Query('mail') mail): Promise<UserDto> {
        return await this.userService.UserDatabyMail(mail);  
    }

    @Patch('updateuser')
    public async UpdateUserData(@Body() UserDto: UserDto): Promise<UserDto> {
        return await this.userService.UpdateUserData(UserDto);
    }

    @Post('pfpload')
    @UseInterceptors(FileInterceptor('image', {
        storage: UserImageStorage,
        fileFilter:ImageFilter
    }))
    public async uploadPicture(@UploadedFile() file: Express.Multer.File){
        if(!file){
            throw new BadRequestException("File is not an image")
        } else {
            const image = {
                success: 1,
                file:{
                    url: 'http://localhost:3000/user/images/' + file.originalname.split('*')[0] +'/' + file.filename
                }
            };
            return image
        }
    }

    @Get('images/:usermail/:filename')
    async getImage(@Param('filename') filename, @Param('usermail') usermail , @Res() res:Response) {
        res.sendFile(filename, {root:'./assets/users/'+ usermail});
    }
}
