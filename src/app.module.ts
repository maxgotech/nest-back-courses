import { StudiesModule } from './modules/studies/studies.module';
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
    StudiesModule,
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot(DataOptions),
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [ AppService],
})
export class AppModule { }
