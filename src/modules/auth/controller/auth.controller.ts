import { Controller,Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminRepository } from 'src/modules/admin/services/admin.repository';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService:AuthService,
        private AdminRepository:AdminRepository
        ){

    }

    @UseGuards(AuthGuard('local'))
    @Post('login')
        async login(@Request()req){
            return this.authService.login(req.user);
        }

    @UseGuards(AuthGuard('jwt'))
    @Post('profile')
    getProfile(@Request()req){
        return req.user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('refresh')
    async refresh(@Request()req){
        const admin = await this.AdminRepository.Find(req.user.id)
        return this.authService.login(req.user);
    }

}