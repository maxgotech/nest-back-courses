import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/service/user-services.service';
import { CreateUserDto } from 'src/modules/user/dto/user-create.dto';
import { RegistrationStatus } from '../interfaces/register-status.interface';
import { LoginStatus } from '../interfaces/login-status.interface';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { LoginUserDto } from 'src/modules/user/dto/user-login.dto';
import { JwtPayload } from '../interfaces/payload.interface';
import * as dotenv from 'dotenv';
import { CreateUserDtoToUserFolderDto } from 'src/shared/mapper';
dotenv.config();

@Injectable()
export class AuthService { 
    constructor(private readonly usersService: UserService, private readonly jwtService: JwtService,  ) {}

    async register(userDto: CreateUserDto): 
    Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
        success: true,   
        message: 'user registered',
    };
    try {
        await this.usersService.create(userDto);
    } catch (err) {
        status = {
            success: false,        
            message: err,
        };    
    }
    await this.usersService.createUserFolder(CreateUserDtoToUserFolderDto(userDto)); //создание папки
    return status;  
}

async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {    
    // find user in db  
    const user = await this.usersService.findByMail(loginUserDto);
    
    // generate and sign token    
    const token = this._createToken(user);
    
    return {
        mail: user.mail, ...token,    
    };  
}

private _createToken({ mail }: UserDto): any {
    const user: JwtPayload = { mail };   
    const expiresIn = process.env.JWT_EXPIRES_IN; 
    const accessToken = this.jwtService.sign(user);    
    return {
        expiresIn,
        accessToken,    
    };  
}

async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload);    
    if (!user) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);    
    }    
    return user;  
}

}
