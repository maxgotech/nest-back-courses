import { Controller, Body, Post, UseInterceptors, UploadedFile, Get, Param, Res, Headers } from '@nestjs/common';
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

    @Post('debug')
        public async devug() {
        const error = {
            success:0,
            error:"debug"
        }
        return error
    }

    @Post('picload')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination:(req,file,cb) => {
                cb(null,'./assets/studies/study_'+ req.headers.study + '/');
            },
            filename:(req,file,cb) => {
                const name = file.originalname.split(".")[0];
                const fileExtension = file.originalname.split(".").pop();
                const newFileName  = name.split(/[!\s#]+/).join('_')+ '.' +fileExtension;
                cb(null, newFileName);
            },
        }),
        fileFilter:( req, file, cb) => {
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(null, false);
            }
            cb(null,true);
        }
    }))
    public async uploadPicture(@UploadedFile() file: Express.Multer.File,@Headers() headers){
        if(!file){
            const image = {
                success: 0,
                error: "File is not an image"
            }
            return image
        } else {
            const image = {
                success: 1,
                file:{
                    url: 'http://localhost:3000/studies/' + headers.study + '/images/' + file.filename
                }
            };
            return image
        }
    }

    @Get(':studyid/images/:filename')
    async getImage(@Param('filename') filename, @Param('studyid') studyid , @Res() res:Response) {
        console.log(filename)
        res.sendFile(filename, {root:'./assets/studies/study_'+ studyid});
    }

}
