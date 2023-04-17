import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './model/user.entity';
import { UserService } from './service/user-services.service';
import { UserController } from './controller/user-controller.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService],
    exports:[UserService]
})
export class UserModule {}
