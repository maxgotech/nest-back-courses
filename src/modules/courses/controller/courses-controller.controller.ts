import { Controller, Body, Post, Get, UseInterceptors, UploadedFile, BadRequestException, Param, Res, Query, Patch, Delete } from '@nestjs/common';
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

    @Post('updatecourse')  
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

    @Post('updatecoursedesc')  
        public async CourseDescUpdate(@Body() CourseDescDto: CourseDescDto) {
        return await this.courseService.UpdateCourseDesc(CourseDescDto);  
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
            console.log(id)
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

    @Post('modulelist')  
        public async ModuleList(@Body() id: CourseDto) {
        return await this.courseService.ModuleListByCourse(id);  
    }

    @Post('findmodule')  
        public async FindModule(@Body() moduleDto: ModuleDto) {
        return await this.courseService.FindModuleByID(moduleDto);  
    }

    @Post('updatemoduleorder')  
        public async UpdateModuleOrder(@Body() moduleOrder:ModuleOrderArrayDto) {
        return await this.courseService.UpdateModuleOrder(moduleOrder.moduleArray);  
    }

    @Post('testing')  
        public async Test(@Body() id:CoursesEntity) {
        return await this.courseService.MaxModuleOrderValue(id);  
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
            @Query('secondarytag') secondarytag: string,)
    {
        return await this.courseService.catalogfind(primarytag,secondarytag)
    }

    @Get('search/?')
        public async search(
            @Query('text') text:string
        )
    {
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
