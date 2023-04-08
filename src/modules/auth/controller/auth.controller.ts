import { Controller,Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from '../services/auth.service';
import { User } from 'src/modules/user/model/user.entity';

@Controller('auth')
export class AuthController {
    private userRepository: Repository<User>;
    constructor(
        private authService:AuthService,
        @InjectDataSource() private dataSource: DataSource
        ){
            this.userRepository = this.dataSource.getRepository(User)

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
        const user = await this.userRepository.findOne(req.user.id)
        return this.authService.login(user);
    }

}