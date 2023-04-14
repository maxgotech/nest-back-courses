import { UserController } from './modules/user/controller/user-controller.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import DataOptions from './config/ormconfig';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot(DataOptions),
    ConfigModule.forRoot()
  ],
  controllers: [
    UserController, AppController],
  providers: [AppService],
})
export class AppModule { }
