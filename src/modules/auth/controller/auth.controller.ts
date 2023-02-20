import { Controller,Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from '../services/auth.service';
import { Admin } from 'src/modules/admin/model/admin.entity';

@Controller('auth')
export class AuthController {
    private adminRepository: Repository<Admin>;
    constructor(
        private authService:AuthService,
        @InjectDataSource() private dataSource: DataSource
        ){
            this.adminRepository = this.dataSource.getRepository(Admin)

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
        const admin = await this.adminRepository.findOne(req.user.id)
        return this.authService.login(admin);
    }

}