import { Controller, Body, Post, Get, UseInterceptors, UploadedFile, BadRequestException, Param, Res, Query, Patch, Delete, Put } from '@nestjs/common';
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
import { CreatePrimaryTagDto } from '../dto/tags/primarytag-create.dto';
import { CreateSecondaryTagDto } from '../dto/tags/secondarytag-create.dto';
import { ModuleOrderArrayDto } from '../dto/module/module-order-array.dto';
import { CoursesEntity } from '../model/course.entity';
@Controller('courses')
export class CoursesController {

    constructor(private readonly courseService: CoursesService,) {}

    //////////////////// ЗАПРОСЫ РАБОТЫ С КУРСАМИ  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Post('newcourse')
        public async CourseCreate(@Body() createCourseDto: CreateCourseDto) {
        return await this.courseService.createCourse(createCourseDto);  
    }

    @Patch('updatecourse')  
        public async CourseUpdate(@Body() CourseDto: CourseDto) {
        return await this.courseService.UpdateCourse(CourseDto);  
    }

    @Delete('deletecourse/:id')  
        public async CourseDelete(@Param('id') id) {
        return await this.courseService.deleteCourse(id);  
    }

    @Post('newcoursedesc')  
        public async CourseDescCreate(@Body() createCourseDescDto: CreateCourseDescDto) {
        return await this.courseService.createCourseDesc(createCourseDescDto);  
    }

    @Put('updatecoursedesc')  
        public async CourseDescUpdate(@Body() CourseDescDto: CourseDescDto) {
        return await this.courseService.UpdateCourseDesc(CourseDescDto);  
    }

    @Get('courselist?')  
        public async CourseList(@Query('user') user) {
        return await this.courseService.CoursesListByCreatorID(user);  
    }

    @Get('findcoursebyid?')  
        public async FundCourse(@Query('id') id) {
        return await this.courseService.FindCourseByID(id);  
    }

    @Get('findcoursebytranslit?')  
        public async FundCourseByTranslit(@Query('translit') translit) {
        return await this.courseService.FindCourseByTranslit(translit);  
    }

    @Post('coursepic')
    @UseInterceptors(FileInterceptor('image', {
        storage: CourseImagesStorage,
        fileFilter: ImageFilter
    }))
    uploadPicture(@UploadedFile() file: Express.Multer.File){
        
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

    @Patch('publish')
        public async PublishCourse(@Body() id: CourseDto){
        return await this.courseService.publishCourse(id)
    }
    

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    //////////////////// ЗАПРОСЫ РАБОТЫ С МОДУЛЯМИ  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

     @Post('newmodule')  
        public async ModuleCreate(@Body() createModuleDto: CreateModuleDto) {
        return await this.courseService.createModule(createModuleDto);  
    }

    @Delete('deletemodule/:id')  
        public async ModuleDelete(@Param('id') id) {
        return await this.courseService.deleteModule(id);  
    }

    @Get('modulelist?')  
        public async ModuleList(@Query('id') id) {
        return await this.courseService.ModuleListByCourse(id);  
    }

    @Get('findmodule?')  
        public async FindModule(@Query('id') id) {
        return await this.courseService.FindModuleByID(id);  
    }

    @Patch('updatemoduleorder')  
        public async UpdateModuleOrder(@Body() moduleOrder:ModuleOrderArrayDto) {
        return await this.courseService.UpdateModuleOrder(moduleOrder.moduleArray);  
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    //////////////////// ФИЛЬТРЫ  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Get('allcourses')
        public async AllCourses(){
        return await this.courseService.AllCourses();
    }

    @Get('catalog/tags?')
        public async findbytags(
            @Query('primarytag') primarytag: string,
            @Query('secondarytag') secondarytag: string,) {
        return await this.courseService.catalogfind(primarytag,secondarytag)
    }

    @Get('search/?')
        public async search(@Query('text') text:string) {
        return await this.courseService.search(text)
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    //////////////////// ЗАПРОСЫ РАБОТЫ С ТЕГАМИ ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Post('primarytagcreate')  
        public async PrimaryTagCreate(@Body() name: CreatePrimaryTagDto) {
        return await this.courseService.createPrimaryTag(name);  
    }

    @Post('secondarytagcreate')  
        public async SecondaryTagCreate(@Body() secondarytag: CreateSecondaryTagDto) {
        return await this.courseService.createSecondaryTag(secondarytag);  
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 }
