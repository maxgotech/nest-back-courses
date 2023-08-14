import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateModuleDto } from '../dto/module/module-create.dto';
import { ModuleDto } from '../dto/module/module.dto';
import { ModuleEntity } from '../model/module.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoursesEntity } from '../model/course.entity';
import { toModuleDto, toCourseDto, toCourseDescDto, toStudyDto } from 'src/shared/mapper';
import { CreateCourseDto } from '../dto/course/course-create.dto';
import { CourseDto } from '../dto/course/course.dto';
import { CreateCourseDescDto } from '../dto/coursedesc/coursedesc-create.dto';
import { CourseDescDto } from '../dto/coursedesc/coursedesc.dto';
import { CourseDescriptionEntity } from '../model/coursedesc.entity';
import { StudiesEntity } from 'src/modules/studies/model/studies.entity';
import { CreateCourseFolderDto } from '../dto/course/course-folder.dto';

@Injectable()
export class CoursesService { 

    constructor( 
        @InjectRepository(ModuleEntity) private readonly moduleRepo: Repository<ModuleEntity>,
        @InjectRepository(StudiesEntity) private readonly studyRepo: Repository<StudiesEntity>,
        @InjectRepository(CoursesEntity) private readonly courseRepo: Repository<CoursesEntity>,
        @InjectRepository(CourseDescriptionEntity) private readonly coursedescRepo: Repository<CourseDescriptionEntity>
        ){}

    async createModule(moduleDto: CreateModuleDto): Promise<ModuleDto> {    
        const { name, about, course } = moduleDto;
        
        const module: ModuleEntity = await this.moduleRepo.create({ name, about, course });
        await this.moduleRepo.save(module);
        return toModuleDto(module);
    }

    async deleteModule(moduleDto: ModuleDto) {    
        const { id  } = moduleDto;
        
        // check if the study exists in the db    
        const moduleInDb = await this.moduleRepo.findOne({ 
            where: { id } 
        });
        if (!moduleInDb) {
            throw new HttpException('module not found', HttpStatus.BAD_REQUEST);    
        }

        const CleanStudies = await this.studyRepo
        .createQueryBuilder()
        .update(StudiesEntity)
        .set({module:null})
        .where("module = :module",{ module:id})
        .execute()

        await this.moduleRepo.remove(moduleInDb);

        return ('module '+ id + ' deleted');
    }

    async createCourse(courseDto: CreateCourseDto): Promise<CourseDto> {    
        const { name, user, price, image_path  } = courseDto;
        
        const course: CoursesEntity = await this.courseRepo.create({ name, user, price, image_path });
        await this.courseRepo.save(course);
        this.createCourseFolder(course);
        return toCourseDto(course);
    }

    async UpdateCourse(courseDto: CourseDto): Promise<CourseDto> {    
        const {id, name, price, image_path } = courseDto;

        await this.courseRepo.save({id:id,name:name,price:price,image_path:image_path});
        const course = await this.courseRepo.findOne({where:{id}})
        return toCourseDto(course);
    }
    

    async deleteCourse(courseDto: CourseDto) {    
        const { id  } = courseDto;
        
        // check if the study exists in the db    
        const courseInDb = await this.courseRepo.findOne({ 
            where: { id } 
        });
        if (!courseInDb) {
            throw new HttpException('course not found', HttpStatus.BAD_REQUEST);    
        }

        const CleanStudies = await this.studyRepo
        .createQueryBuilder()
        .where("course = :course",{course:id})
        .update(StudiesEntity)
        .set({module:null,course:null})
        .execute()

        await this.courseRepo.remove(courseInDb);
        return toCourseDto(courseInDb);
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
        const ModuleList = await this.courseRepo
        .createQueryBuilder("course")
        .leftJoinAndSelect("course.user","user")
        .leftJoinAndSelect("course.module","module")
        .leftJoinAndSelect("module.study","study")
        .where({
            "id":id
        })
        .getMany();
        return ModuleList;
    }
    }

    async AllCourses(){
        const CoursesList = await this.courseRepo.find({relations:['user']});
        return CoursesList;
    }

    async createCourseFolder(createCourseFolder:CreateCourseFolderDto){
        const fs = require('fs');
        const folderName = "assets/courses/course_" + createCourseFolder.id;

        try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
        } catch (err) {
        console.error(err);
        }
        return folderName
    }

}
