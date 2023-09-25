import { Module } from '@nestjs/common';
import { CoursesController } from './controller/courses-controller.controller';
import { CoursesEntity } from './model/course.entity';
import { ModuleEntity } from './model/module.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './service/courses-services.service';
import { CourseDescriptionEntity } from './model/coursedesc.entity';
import { StudiesEntity } from '../studies/model/studies.entity';
import { PrimaryTagEntity } from './model/primarytag.entity';
import { SecondaryTagEntity } from './model/secondarytag.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CoursesEntity,ModuleEntity,CourseDescriptionEntity,StudiesEntity,PrimaryTagEntity,SecondaryTagEntity])],
    controllers: [CoursesController],
    providers: [CoursesService],
})
export class CourseModule {}
