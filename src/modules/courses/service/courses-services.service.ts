import { Injectable } from '@nestjs/common';
import { CreateModuleDto } from '../dto/module/module-create.dto';
import { ModuleDto } from '../dto/module/module.dto';
import { ModuleEntity } from '../model/module.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoursesEntity } from '../model/course.entity';
import { toModuleDto, toCourseDto, toCourseDescDto } from 'src/shared/mapper';
import { CreateCourseDto } from '../dto/course/course-create.dto';
import { CourseDto } from '../dto/course/course.dto';
import { CreateCourseDescDto } from '../dto/coursedesc/coursedesc-create.dto';
import { CourseDescDto } from '../dto/coursedesc/coursedesc.dto';
import { CourseDescriptionEntity } from '../model/coursedesc.entity';


@Injectable()
export class CoursesService { 

    constructor( 
        @InjectRepository(ModuleEntity) private readonly moduleRepo: Repository<ModuleEntity>,
        @InjectRepository(CoursesEntity) private readonly courseRepo: Repository<CoursesEntity>,
        @InjectRepository(CourseDescriptionEntity) private readonly coursedescRepo: Repository<CourseDescriptionEntity>
        ){}

    async createModule(moduleDto: CreateModuleDto): Promise<ModuleDto> {    
        const { name, about, course } = moduleDto;
        
        const module: ModuleEntity = await this.moduleRepo.create({ name, about, course });
        await this.moduleRepo.save(module);
        return toModuleDto(module);
    }

    async createCourse(courseDto: CreateCourseDto): Promise<CourseDto> {    
        const { name, user, price, image_path  } = courseDto;
        
        const course: CoursesEntity = await this.courseRepo.create({ name, user, price, image_path });
        await this.courseRepo.save(course);
        return toCourseDto(course);
    }

    async createCourseDesc(coursedescDto: CreateCourseDescDto): Promise<CourseDescDto> {    
        const {course, shortabout, learn, req, about, audience } = coursedescDto;
        
        const coursedesc: CourseDescriptionEntity = await this.coursedescRepo.create({ course,shortabout, learn, req, about, audience });
        await this.coursedescRepo.save(coursedesc);
        return toCourseDescDto(coursedesc);
    }

    async UpdateCourseDesc(coursedescDto: CourseDescDto): Promise<CourseDescDto> {    
        const {id, course, shortabout, learn, req, about, audience } = coursedescDto;

        await this.coursedescRepo.save({id:id,course:course,shortabout:shortabout,learn:learn,req:req,about:about,audience:audience});
        const coursedesc = await this.coursedescRepo.findOne({where:{id}})
        return toCourseDescDto(coursedesc);
    }
    

    async CoursesListByCreatorID({ user }: CourseDto){
        if (user==null){
            return;
        } else {
            const CoursesList = await this.courseRepo
            .createQueryBuilder("course")
            .where({
                "user":user
            })
            .getMany();
        return CoursesList.reverse();
    }
    }

    async FindCourseByID({id}:CourseDto){ //возвращает лишнюю информацию пользователя
        if (id==null){
            return;
        } else {
        const Course = await this.courseRepo.findOne({relations:['user','coursedesc'], where: { id } });
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
         .leftJoinAndSelect("course.user","user")
        .leftJoinAndSelect("course.module","module")
        .leftJoinAndSelect("module.study","study")
        .where({
            "id":id
        })
        .getMany();
        return CoursesList;
    }
    }

    async AllCourses(){
        const CoursesList = await this.courseRepo.find({relations:['user']});
        return CoursesList;
    }

}
