import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { StudiesEntity } from 'src/modules/studies/model/studies.entity';
import { CreateCourseFolderDto } from '../dto/course/course-folder.dto';
import { Translit } from 'src/shared/utils';
import { CreatePrimaryTagDto } from '../dto/tags/primarytag-create.dto';
import { PrimaryTagEntity } from '../model/primarytag.entity';
import { SecondaryTagEntity } from '../model/secondarytag.entity';
import { CreateSecondaryTagDto } from '../dto/tags/secondarytag-create.dto';
import { ModuleOrderDto } from '../dto/module/module-order-array.dto';

@Injectable()
export class CoursesService { 

    constructor( 
        @InjectRepository(ModuleEntity) private readonly moduleRepo: Repository<ModuleEntity>,
        @InjectRepository(StudiesEntity) private readonly studyRepo: Repository<StudiesEntity>,
        @InjectRepository(CoursesEntity) private readonly courseRepo: Repository<CoursesEntity>,
        @InjectRepository(CourseDescriptionEntity) private readonly coursedescRepo: Repository<CourseDescriptionEntity>,
        @InjectRepository(PrimaryTagEntity) private readonly primarytagRepo: Repository<PrimaryTagEntity>,
        @InjectRepository(SecondaryTagEntity) private readonly secondarytagRepo: Repository<SecondaryTagEntity>
        ){}

    async createModule(moduleDto: CreateModuleDto): Promise<ModuleDto> {    
        const { name, about, course } = moduleDto;
        console.log(course)
        const module_order = await this.MaxModuleOrderValue(course) + 1
        const module: ModuleEntity = await this.moduleRepo.create({ name, about, course, module_order });
        await this.moduleRepo.save(module);
        return toModuleDto(module);
    }

    async deleteModule(moduleDto: ModuleDto) {    
        const { id  } = moduleDto;
        
        // check if the module exists in the db    
        const moduleInDb = await this.moduleRepo.findOne({ 
            where: { id } 
        });
        if (!moduleInDb) {
            throw new HttpException('module not found', HttpStatus.BAD_REQUEST);    
        }

        await this.studyRepo
        .createQueryBuilder()
        .update(StudiesEntity)
        .set({module:null})
        .where("module = :module",{ module:id})
        .execute()

        await this.moduleRepo.remove(moduleInDb);

        const res = {
            "deleted":'module ' + id
        }
        return res
    }

    async createCourse(courseDto: CreateCourseDto): Promise<CourseDto> {    
        const { name, user, price, image_path  } = courseDto;

        const translit = await Translit(name)
        
        const course: CoursesEntity = await this.courseRepo.create({ name,translit, user, price, image_path });
        await this.courseRepo.save(course);
        this.createCourseFolder(course);
        return toCourseDto(course);
    }

    async UpdateCourse(courseDto: CourseDto): Promise<CourseDto> {    
        const {id, name, price, image_path } = courseDto;

        const translit = await Translit(name)

        await this.courseRepo.createQueryBuilder()
        .update()
        .set({name:name, translit:translit, price:price, image_path:image_path})
        .where("id=:id",{id:id})
        .execute()
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

        await this.studyRepo
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

        await this.coursedescRepo.createQueryBuilder()
        .update()
        .set({course:course, shortabout:shortabout, learn:learn, req:req, about:about, audience:audience})
        .where("id=:id",{id:id})
        .execute()
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

    async FindCourseByID({id}:CourseDto){ //возвращает лишнюю информацию 
        if (id==null){
            return;
        } else {
        const Course = await this.courseRepo.findOne({relations:['user','coursedesc'], where: { id } });
        return toCourseDto(Course);
    }
    }

    async FindCourseByTranslit({translit}:CourseDto){
        if (translit==null){
            return;
        } else {
        const Course = await this.courseRepo.findOne({relations:['user','coursedesc'], where: { translit } });
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
        .leftJoinAndSelect("course.coursedesc","coursedesc")
        .leftJoinAndSelect("course.user","user")
        .leftJoinAndSelect("course.module","module")
        .leftJoinAndSelect("module.study","study")
        .where({
            "id":id
        })
        .orderBy("module.module_order","ASC")
        .getMany();
        return ModuleList;
    }
    }

    async AllCourses(){
        const CoursesList = await this.courseRepo.find({relations:['user']});
        return CoursesList;
    }

    async filterfind(date:string,price:string){
        const from = price.split('/')[0]
        const to = price.split('/')[1]

        let dateorder

        if (date=='newer'){
            dateorder = 'DESC'
        } else
            dateorder = "ASC"

        const CoursesList = await this.courseRepo
        .createQueryBuilder("course")
        .leftJoinAndSelect("course.user","user")
        .orderBy("course.createdAt", dateorder)
        .where(
            'course.price >= :price',
            {
              price: from,
            }
        )
        .andWhere(
            'course.price <= :to',
            {
              to: to,
            }
        )
        .getMany();
        return CoursesList
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

    async createPrimaryTag(createPrimaryTag:CreatePrimaryTagDto){
        const { name } = createPrimaryTag;
        
        const primarytag: PrimaryTagEntity = await this.primarytagRepo.create({ name });
        await this.primarytagRepo.save(primarytag);
        return primarytag
    }

    async createSecondaryTag(createSecondaryTag:CreateSecondaryTagDto){
        const { name, primarytag } = createSecondaryTag;
        
        const secondarytag: SecondaryTagEntity = await this.secondarytagRepo.create({ name,primarytag });
        await this.secondarytagRepo.save(secondarytag);
        return secondarytag
    }

    async UpdateModuleOrder(moduleOrder:ModuleOrderDto[]){
        moduleOrder.forEach(async element =>{
            await this.moduleRepo.createQueryBuilder()
            .update()
            .set({module_order:element.module_order})
            .where("id=:id",{id:element.id})
            .execute()
        })
        const done = {
            "success":1
        }
        return(done)
    }

    async MaxModuleOrderValue(courseid:CoursesEntity){
        const order = await this.moduleRepo .createQueryBuilder()
        .where({
            "course":courseid
        })
        .orderBy("module_order","DESC")
        .getOne();
        return order.module_order
    }
}
