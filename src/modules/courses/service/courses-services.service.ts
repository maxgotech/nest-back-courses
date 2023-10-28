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
const fs = require('fs');

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


    //////////////////// ФУНКЦИИ РАБОТЫ С КУРСАМИ //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async createCourse(courseDto: CreateCourseDto): Promise<CourseDto> {    // содание курса
        const { name, user, price, image_path  } = courseDto;

        const translit = await Translit(name)
        
        const course: CoursesEntity = await this.courseRepo.create({ name,translit, user, price, image_path });
        await this.courseRepo.save(course);
        this.createCourseFolder(course);
        return toCourseDto(course);
    }

    async UpdateCourse(courseDto: CourseDto): Promise<CourseDto> {    // обновление курса
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

    async deleteCourse(id: number) {    // удаление курса

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
        const courseDto:CourseDto = {
            id: id,
            name: null,
            translit: null,
            coursedesc: null,
            published: null,
            user: null
        }
        await this.courseRepo.remove(courseInDb);
        await this.deleteCourseFolder(courseDto);
        return toCourseDto(courseInDb);
    }

    async createCourseDesc(coursedescDto: CreateCourseDescDto): Promise<CourseDescDto> {    // создание описания курса
        const {course, shortabout, learn, req, about, audience } = coursedescDto;
        
        const coursedesc: CourseDescriptionEntity = await this.coursedescRepo.create({ course,shortabout, learn, req, about, audience });
        await this.coursedescRepo.save(coursedesc);
        return toCourseDescDto(coursedesc);
    }

    async UpdateCourseDesc(coursedescDto: CourseDescDto): Promise<CourseDescDto> {    // обновление описания курса
        const {id, course, shortabout, learn, req, about, audience } = coursedescDto;

        await this.coursedescRepo.createQueryBuilder()
        .update()
        .set({course:course, shortabout:shortabout, learn:learn, req:req, about:about, audience:audience})
        .where("id=:id",{id:id})
        .execute()
        const coursedesc = await this.coursedescRepo.findOne({where:{id}})
        return toCourseDescDto(coursedesc);
    }
    
    async CoursesListByCreatorID({ user }: CourseDto){   // поиск списка курсов пользователей
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

    async FindCourseByID({id}:CourseDto){    // поиск курса по айди               //возвращает лишнюю информацию 
        if (id==null){
            return;
        } else {
        const Course = await this.courseRepo.findOne({relations:['user','coursedesc'], where: { id } });
        return toCourseDto(Course);
    }
    }

    async FindCourseByTranslit({translit}:CourseDto){  // поиск курса по транслиту
        if (translit==null){
            return;
        } else {
        const Course = await this.courseRepo.findOne({relations:['user','coursedesc'], where: { translit } });
        return toCourseDto(Course);
    }
    }

    async createCourseFolder(createCourseFolder:CreateCourseFolderDto){  // содание папки курса в фс
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

    async deleteCourseFolder(course:CourseDto) {  // удаление папки курса из фс

        const folderName = "assets/courses/course_" + course.id;
        try {
            if (fs.existsSync(folderName)) {
                fs.rmSync(folderName, { recursive: true, force: true });
            }
            } catch (err) {
            console.error(err);
            }
        return 'folder ' + folderName + ' deleted'
    }

    async publishCourse(courseDto:CourseDto){
        const {id} = courseDto
        await this.courseRepo.createQueryBuilder()
        .update()
        .set({published:true})
        .where("id=:id",{id:id})
        .execute()
        const course = await this.courseRepo.findOne({where:{id}})
        return toCourseDto(course);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    //////////////////// ФУНКЦИИ РАБОТЫ С МОДУЛЯМИ //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async createModule(moduleDto: CreateModuleDto): Promise<ModuleDto> {    // создание модуля 
        const { name, about, course } = moduleDto;
        console.log(course)
        const module_order = await this.MaxModuleOrderValue(course) + 1
        const module: ModuleEntity = await this.moduleRepo.create({ name, about, course, module_order });
        await this.moduleRepo.save(module);
        return toModuleDto(module);
    }

    async deleteModule(id:number) {    // удаление модуля
        
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

    async FindModuleByID({id}:ModuleDto){   // поиск модуля по ид
        if (id==null){
            return;
        } else {
        const Study = await this.moduleRepo.findOne({relations:['course'], where: { id } });
        return toModuleDto(Study);
    }
    }

    async ModuleListByCourse({ id }:CourseDto){ // поиск всех модулей курса
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

    async UpdateModuleOrder(moduleOrder:ModuleOrderDto[]){ // обновление порядка модулей в курсе
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

    async MaxModuleOrderValue(courseid:CoursesEntity){ // поиск последнего модуля в очереди
        const order = await this.moduleRepo .createQueryBuilder()
        .where({
            "course":courseid
        })
        .orderBy("module_order","DESC")
        .getOne();
        if (order==null){
            return 0
        }
        return order.module_order
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    //////////////////// ФИЛЬТРЫ //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async AllCourses(){  //поиск всех куров

        const CoursesList = await this.courseRepo.find({relations:['user','primarytag','secondarytag'],where:{published:true}});
        return CoursesList;
    }

    async catalogfind(primarytag:string,secondarytag:string){  //фильтр по датам и ценам
        if (primarytag==null)
        {
            return this.AllCourses()
        } else if (secondarytag==null){
            const primary_tag = await this.primarytagRepo.find({where:{
                translation:primarytag
            }})
            const CoursesList = await this.courseRepo
            .createQueryBuilder("course")
            .leftJoinAndSelect("course.user","user")
            .leftJoin("course.primarytag","primarytag")
            .where({
                "published":true
            })
            .andWhere(
                "primarytag.translation=:primarytag",{primarytag:primarytag}
            )
            .getMany();
            const response = {
                'primarytag':primary_tag,
                'courses':CoursesList
            }
            return response
        }
        const primary_tag = await this.primarytagRepo.find({where:{
            translation:primarytag
        }})
        const secondary_tag = await this.secondarytagRepo.find({where:{
            translation:secondarytag
        }})
        const CoursesList = await this.courseRepo
        .createQueryBuilder("course")
        .leftJoinAndSelect("course.user","user")
        .leftJoin("course.primarytag","primarytag")
        .leftJoin("course.secondarytag","secondarytag")
        .where({
            "published":true
        })
        .andWhere(
            "primarytag.translation=:primarytag",{primarytag:primarytag}
        )
        .andWhere(
            "secondarytag.translation=:secondarytag",{secondarytag:secondarytag}
        )
        .getMany();
        const response = {
                'primarytag':primary_tag,
                'secondarytag':secondary_tag,
                'courses':CoursesList
            }
        return response
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    //////////////////// ФУНКЦИИ РАБОТЫ С ТЕГАМИ //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async createPrimaryTag(createPrimaryTag:CreatePrimaryTagDto){ // создание первичного тега
        const { name } = createPrimaryTag;
        
        const primarytag: PrimaryTagEntity = await this.primarytagRepo.create({ name });
        await this.primarytagRepo.save(primarytag);
        return primarytag
    }

    async createSecondaryTag(createSecondaryTag:CreateSecondaryTagDto){ // создание вторичного тега
        const { name, primarytag } = createSecondaryTag;
        
        const secondarytag: SecondaryTagEntity = await this.secondarytagRepo.create({ name,primarytag });
        await this.secondarytagRepo.save(secondarytag);
        return secondarytag
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
