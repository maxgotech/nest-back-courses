import { Module } from '@nestjs/common';
import { StudiesController } from './controller/studies-controller.controller';
import { StudiesServices } from './service/studies-services.service';
import { StudiesEntity } from './model/studies.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([StudiesEntity])],
    controllers: [StudiesController],
    providers: [StudiesServices],
})
export class StudiesModule {}
