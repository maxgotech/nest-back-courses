import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthControllerController } from './controller/auth-controller.controller';
import { AuthServiceService } from './service/auth-service.service';
import { JwtStrategy } from './service/jwt-strategy';

@Module({  
    imports: [    
        UserModule,    
        PassportModule.register({
            defaultStrategy: 'jwt',
            property: 'user',
            session: false,
        }),
        JwtModule.register({
            secret: process.env.JWT_KEY, signOptions: {
                expiresIn: process.env.JWT_EXPIRES_IN,
            },
        }),
    ], 
    controllers: [AuthControllerController],  
    providers: [AuthServiceService, JwtStrategy],  
    exports: [
        PassportModule, 
        JwtModule
    ],
})
export class AuthModule {}