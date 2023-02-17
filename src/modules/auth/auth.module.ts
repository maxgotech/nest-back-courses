import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from '../admin/admin.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './services/local.strategy';

@Module({
  imports:[AdminModule,PassportModule],
  controllers:[AuthController],
  providers:[AuthService,LocalStrategy]
})
export class AuthModule {}
