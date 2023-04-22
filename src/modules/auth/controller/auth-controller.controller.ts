import {Controller, Body, Post, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../service/auth-service.service';
import { LoginUserDto } from 'src/modules/user/dto/user-login.dto';
import { CreateUserDto } from 'src/modules/user/dto/user-create.dto';
import { RegistrationStatus } from '../interfaces/register-status.interface';
import { LoginStatus } from '../interfaces/login-status.interface';

@Controller('auth')
export class AuthController{ 
    constructor(private readonly authService: AuthService) {}

    @Post('reg')  
    public async register(@Body() createUserDto: CreateUserDto,  ): Promise<RegistrationStatus> {    
        const result: 
        RegistrationStatus = await this.authService.register(createUserDto);
        if (!result.success) {
            throw new HttpException(result.message, HttpStatus.BAD_REQUEST);    
        }
        return result;  
    }

    @Post('login')  
        public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
        return await this.authService.login(loginUserDto);  
    }

    
}
