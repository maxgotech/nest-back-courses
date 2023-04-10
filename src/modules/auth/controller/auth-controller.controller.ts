import {Controller, Body, Post, HttpException, HttpStatus, UsePipes, Get, Req, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthServiceService } from '../service/auth-service.service';
import { LoginUserDto } from 'src/modules/user/dto/user-login.dto';
import { CreateUserDto } from 'src/modules/user/dto/user-create.dto';
import { JwtPayload } from '../interfaces/payload.interface';
import { RegistrationStatus } from '../interfaces/register-status.interface';
import { LoginStatus } from '../interfaces/login-status.interface';

@Controller('auth')
export class AuthControllerController { 
    constructor(private readonly authService: AuthServiceService) {}

    @Post('register')  
    public async register(@Body() createUserDto: CreateUserDto,  ): Promise<RegistrationStatus> {    
        const result: 
        RegistrationStatus = await this.authService.register(createUserDto,);
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
