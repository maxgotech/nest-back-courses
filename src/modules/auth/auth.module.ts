import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './services/jwt.strategy';
import { LocalStrategy } from './services/local.strategy';

@Module({
  imports:[
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory:(configService:ConfigService)=> ({
        secret:configService.get<string>('JWT_SECRET'),
        signOptions:{expiresIn:configService.get<string>('JWT_EXPIRES_IN')}
      }),
      inject:[ConfigService]
    })
  ],
  controllers:[AuthController],
  providers:[AuthService,LocalStrategy,JwtStrategy]
})
export class AuthModule {}
