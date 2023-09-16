import { Controller, Body, Post, Get, UseInterceptors, UploadedFile, BadRequestException, Param, Res } from '@nestjs/common';
import { CoursesService } from '../service/courses-services.service';
import { CreateCourseDto } from '../dto/course/course-create.dto';
import { CreateModuleDto } from '../dto/module/module-create.dto';
import { CourseDto } from '../dto/course/course.dto';
import { ModuleDto } from '../dto/module/module.dto';
import { CreateCourseDescDto } from '../dto/coursedesc/coursedesc-create.dto';
import { CourseDescDto } from '../dto/coursedesc/coursedesc.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { CourseImagesStorage } from 'src/shared/storages';
import { ImageFilter } from 'src/shared/filters';

@Controller('courses')
export class CoursesController {

    constructor(private readonly courseService: CoursesService,) {}

    @Post('newcourse')  
        public async CourseCreate(@Body() createCourseDto: CreateCourseDto) {
        return await this.courseService.createCourse(createCourseDto);  
    }

    @Post('updatecourse')  
        public async CourseUpdate(@Body() CourseDto: CourseDto) {
        return await this.courseService.UpdateCourse(CourseDto);  
    }

    @Post('deletecourse')  
        public async CourseDelete(@Body() courseDto: CourseDto) {
        return await this.courseService.deleteCourse(courseDto);  
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

    @Post('deletemodule')  
        public async ModuleDelete(@Body() ModuleDto: ModuleDto) {
        return await this.courseService.deleteModule(ModuleDto);  
    }

    @Post('courselist')  
        public async CourseList(@Body() courseDto: CourseDto) {
        return await this.courseService.CoursesListByCreatorID(courseDto);  
    }

    @Post('findcoursebyid')  
        public async FundCourse(@Body() courseDto: CourseDto) {
        return await this.courseService.FindCourseByID(courseDto);  
    }

    @Post('findcoursebytranslit')  
        public async FundCourseByTranslit(@Body() courseDto: CourseDto) {
        return await this.courseService.FindCourseByTranslit(courseDto);  
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

    @Post('coursepic')
    @UseInterceptors(FileInterceptor('image', {
        storage: CourseImagesStorage,
        fileFilter: ImageFilter
    }))
    uploadPicture(@UploadedFile() file: Express.Multer.File){
        
        console.log(file)
        if(!file){
            throw new BadRequestException("File is not an image")
        } else {
            const image = {
                success: 1,
                file:{
                    url: 'http://localhost:3000/courses/images/' + file.originalname.split('*')[0] +'/' + file.filename
                }
            };
            return image
        }
    }

    @Get('images/:courseid/:filename')
    async getImage(@Param('filename') filename, @Param('courseid') courseid , @Res() res:Response) {
        res.sendFile(filename, {root:'./assets/courses/'+ courseid});
    }

 }
