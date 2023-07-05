import { Controller, Body, Post, Get } from '@nestjs/common';
import { CoursesService } from '../service/courses-services.service';
import { CreateCourseDto } from '../dto/course/course-create.dto';
import { CreateModuleDto } from '../dto/module/module-create.dto';
import { CourseDto } from '../dto/course/course.dto';
import { ModuleDto } from '../dto/module/module.dto';
import { CreateCourseDescDto } from '../dto/coursedesc/coursedesc-create.dto';
import { CourseDescDto } from '../dto/coursedesc/coursedesc.dto';

@Controller('courses')
export class CoursesController {

    constructor(private readonly courseService: CoursesService,) {}

    @Post('newcourse')  
        public async CourseCreate(@Body() createCourseDto: CreateCourseDto) {
        return await this.courseService.createCourse(createCourseDto);  
    }

    @Post('newcoursedesc')  
        public async CourseDescCreate(@Body() createCourseDescDto: CreateCourseDescDto) {
        return await this.courseService.createCourseDesc(createCourseDescDto);  
    }

    @Post('updatecoursedesc')  
        public async CourseDescUpdate(@Body() CourseDescDto: CourseDescDto) {
        return await this.courseService.UpdateCourseDesc(CourseDescDto);  
    }

    @Post('newmodule')  
        public async ModuleCreate(@Body() createModuleDto: CreateModuleDto) {
        return await this.courseService.createModule(createModuleDto);  
    }

    @Post('courselist')  
        public async CourseList(@Body() courseDto: CourseDto) {
        return await this.courseService.CoursesListByCreatorID(courseDto);  
    }

    @Post('findcourse')  
        public async FundCourse(@Body() courseDto: CourseDto) {
        return await this.courseService.FindCourseByID(courseDto);  
    }

    @Post('modulelist')  
        public async ModuleList(@Body() id: CourseDto) {
        return await this.courseService.ModuleListByCourse(id);  
    }

    @Post('findmodule')  
        public async FindModule(@Body() moduleDto: ModuleDto) {
        return await this.courseService.FindModuleByID(moduleDto);  
    }

    @Get('allcourses')
        public async AllCourses(){
        return await this.courseService.AllCourses();
    }

 }
