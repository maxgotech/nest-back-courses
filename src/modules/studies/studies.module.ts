import { Module } from '@nestjs/common';
import { StudiesController } from './controller/studies-controller.controller';
import { StudiesServices } from './service/studies-services.service';
import { StudiesEntity } from './model/studies.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextEntity } from './model/text.entity';
import { VideoEntity } from './model/video.entity';

@Module({
    imports: [TypeOrmModule.forFeature([StudiesEntity,TextEntity,VideoEntity])],
    controllers: [StudiesController],
    providers: [StudiesServices],
})
export class StudiesModule {}
