import { Module } from '@nestjs/common';
import { CoursesController } from './controller/courses-controller.controller';
import { CoursesEntity } from './model/course.entity';
import { ModuleEntity } from './model/module.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './service/courses-services.service';

@Module({
    imports: [TypeOrmModule.forFeature([CoursesEntity,ModuleEntity])],
    controllers: [CoursesController],
    providers: [CoursesService],
})
export class CourseModule {}
