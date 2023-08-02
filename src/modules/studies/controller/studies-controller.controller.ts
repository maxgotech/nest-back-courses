import { Controller, Body, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { StudiesServices } from '../service/studies-services.service';
import { CreateStudyDto } from '../dto/study/study-create.dto';
import { StudyDto } from '../dto/study/study.dto';
import { CreateVideoDto } from '../dto/video/video-create.dto';
import { CreateTextDto } from '../dto/text/text-create.dto';
import { TextDto } from '../dto/text/text.dto';
import { VideoDto } from '../dto/video/video.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('studies')

export class StudiesController{ 
    constructor(private readonly studyService: StudiesServices) {}

    @Post('newstudy')  
        public async StudyCreate(@Body() createStudyDto: CreateStudyDto) {
        return await this.studyService.createStudy(createStudyDto);  
    }

    @Post('deletestudy')
        public async deleteStudy(@Body() studyDto:StudyDto) {
        return await this.studyService.deleteStudy(studyDto);
    }

    @Post('newtextstudy')  
        public async TextStudyCreate(@Body() createTextDto: CreateTextDto) {
        return await this.studyService.createTextStudy(createTextDto);  
    }

    @Post('newvideostudy')  
        public async VideoStudyCreate(@Body() CreateVideoDto: CreateVideoDto) {
        return await this.studyService.createVideoStudy(CreateVideoDto);  
    }

    @Post('studylist')
        public async getStudies(@Body() studyDto:StudyDto) {
        return await this.studyService.StudyListByCreatorID(studyDto);
    }

    @Post('studylistbymodule')
        public async getStudiesByModule(@Body() id:any) {
        return await this.studyService.StudyListByModule(id);
    }

    @Post('study')
        public async getStudy(@Body() studyDto:StudyDto) {
        return await this.studyService.FindStudyByID(studyDto);
    }

    @Post('updateTypeContent')
        public async updateTypeContent(@Body() studyDto:StudyDto) {
        return await this.studyService.updateStudyTypeContent(studyDto);
    }

    @Post('updateIdContent')
        public async updateIdContent(@Body() studyDto:StudyDto) {
        return await this.studyService.updateStudyIdContent(studyDto);
    }

    @Post('updateCourseAndModule')
        public async updateCourseAndModule(@Body() studyDto:StudyDto) {
        return await this.studyService.updateStudyCourseAndModule(studyDto);
    }

    @Post('updateTextContent')
        public async updateTextContent(@Body() textDto:TextDto) {
        return await this.studyService.updateTextStudy(textDto);
    }

    @Post('updateVideoContent')
        public async updateVideoContent(@Body() videoDto:VideoDto) {
        return await this.studyService.updateVideoStudy(videoDto);
    }

    @Post('getTextContent')
        public async getTextContent(@Body() textDto:TextDto) {
        return await this.studyService.GetTextContent(textDto);
    }

    @Post('picload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination:(req,file,cb) => {
                const usermail= file.originalname.split('*')[0];
                cb(null,'./users/'+usermail + '/');
            },
            filename:(req,file,cb) => {
                const nameOrigin = file.originalname.split("*")[1];
                const name = nameOrigin.split(".")[0];
                const fileExtension = nameOrigin.split(".").pop();
                const newFileName  = name.split(" ").join('_')+ '.' +fileExtension;
                cb(null, newFileName);
            },
        }),
        fileFilter:( req, file, cb) => {
            if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(null, false);
            }
            cb(null,true);
        }
    }))
    uploadPicture(@UploadedFile() file: Express.Multer.File){
        if(!file){
            throw new BadRequestException("File is not an image")
        } else {
            const image = {
                success: 1,
                file:{
                    url: 'http://localhost:3000/user/images/' + file.originalname.split('*')[0] +'/' + file.filename
                }
            };
            return image
        }
    }

}
