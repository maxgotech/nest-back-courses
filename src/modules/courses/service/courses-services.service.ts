import { Injectable } from '@nestjs/common';
import { CreateModuleDto } from '../dto/module/module-create.dto';
import { ModuleDto } from '../dto/module/module.dto';
import { ModuleEntity } from '../model/module.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoursesEntity } from '../model/course.entity';
import { toModuleDto, toCourseDto } from 'src/shared/mapper';
import { CreateCourseDto } from '../dto/course/course-create.dto';
import { CourseDto } from '../dto/course/course.dto';

@Injectable()
export class CoursesService { 

    constructor( 
        @InjectRepository(ModuleEntity) private readonly moduleRepo: Repository<ModuleEntity>,
        @InjectRepository(CoursesEntity) private readonly courseRepo: Repository<CoursesEntity>
        ){}

    async createModule(moduleDto: CreateModuleDto): Promise<ModuleDto> {    
        const { name, about, course } = moduleDto;
        
        const module: ModuleEntity = await this.moduleRepo.create({ name, about, course });
        await this.moduleRepo.save(module);
        return toModuleDto(module);
    }

    async createCourse(courseDto: CreateCourseDto): Promise<CourseDto> {    
        const { name, id_createdBy, price,  } = courseDto;
        
        const course: CoursesEntity = await this.courseRepo.create({ name, id_createdBy, price });
        await this.courseRepo.save(course);
        return toCourseDto(course);
    }

    async CoursesListByCreatorID({ id_createdBy }: CourseDto){
        if (id_createdBy==null){
            return;
        } else {
        const CoursesList = await this.courseRepo.find({ where: { id_createdBy } });
        return CoursesList.reverse();
    }
    }

    async FindCourseByID({id}:CourseDto){
        if (id==null){
            return;
        } else {
        const Course = await this.courseRepo.findOne({ where: { id } });
        return toCourseDto(Course);
    }
    }
    
    async FindModuleByID({id}:ModuleDto){
        if (id==null){
            return;
        } else {
        const Study = await this.moduleRepo.findOne({relations:['course'], where: { id } });
        return toModuleDto(Study);
    }
    }

    async ModuleListByCourse({ id }:CourseDto){
        if (id==null){
            return;
        } else {
        const CoursesList = await this.courseRepo
        .createQueryBuilder("course")
        .leftJoinAndSelect("course.module","module")
        .where({
            "id":id
        })
        .getMany();
        return CoursesList.reverse();
    }
    }

}
