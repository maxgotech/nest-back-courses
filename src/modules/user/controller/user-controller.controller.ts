import {Controller, Body, Post, Get, Param, Res, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { UserService } from '../service/user-services.service';
import { UserDto } from '../dto/user.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('user')
export class UserController { 
    constructor(private readonly userService: UserService) {
        
    }
    @Post('data')
    public async login(@Body() UserDto: UserDto): Promise<UserDto> {
        return await this.userService.UserDatabyMail(UserDto);  
    }

    @Post('updateuser')
    public async UpdateUserData(@Body() UserDto: UserDto): Promise<UserDto> {
        return await this.userService.UpdateUserData(UserDto);
    }

    @Post('pfpload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination:(req,file,cb) => {
                const usermail= file.originalname.split('*')[0];
                cb(null,'./users/'+usermail + '/');
            },
            filename:(req,file,cb) => {
                const nameOrigin = file.originalname.split("*")[1];
                const name = nameOrigin.split(".")[0];
                const fileExtension = nameOrigin.split(".").pop();
                const newFileName  = name.split(" ").join('_')+ '.' +fileExtension;
                cb(null, newFileName);
            },
        }),
        fileFilter:( req, file, cb) => {
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(null, false);
            }
            cb(null,true);
        }
    }))
    uploadPicture(@UploadedFile() file: Express.Multer.File){
        console.log(file)
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
        res.sendFile(filename, {root:'./users/'+ usermail});
    }
}
