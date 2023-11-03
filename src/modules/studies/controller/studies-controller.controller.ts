import { Controller, Body, Post, UseInterceptors, UploadedFile, Get, Param, Res, Headers, Delete, Query, Patch } from '@nestjs/common';
import { StudiesServices } from '../service/studies-services.service';
import { CreateStudyDto } from '../dto/study/study-create.dto';
import { StudyDto } from '../dto/study/study.dto';
import { CreateVideoDto } from '../dto/video/video-create.dto';
import { CreateTextDto } from '../dto/text/text-create.dto';
import { TextDto } from '../dto/text/text.dto';
import { VideoDto } from '../dto/video/video.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { StudyImageStorage } from 'src/shared/storages';
import { ImageFilter, VideoFilter } from 'src/shared/filters';

@Controller('studies')

export class StudiesController{ 
    constructor(private readonly studyService: StudiesServices) {}

    @Post('newstudy')  
        public async StudyCreate(@Body() createStudyDto: CreateStudyDto) {
        return await this.studyService.createStudy(createStudyDto);  
    }

    @Delete('deletestudy/:id')
        public async deleteStudy(@Param('id') id) {
        return await this.studyService.deleteStudy(id);
    }

    @Post('newtextstudy')  
        public async TextStudyCreate(@Body() createTextDto: CreateTextDto) {
        return await this.studyService.createTextStudy(createTextDto);  
    }

    @Post('newvideostudy')  
        public async VideoStudyCreate(@Body() CreateVideoDto: CreateVideoDto) {
        return await this.studyService.createVideoStudy(CreateVideoDto);  
    }

    @Get('studylist?')
        public async getStudies(@Query('user') user) {
        return await this.studyService.StudyListByCreatorID(user);
    }

    @Get('studylistbymodule?')
        public async getStudiesByModule(@Query('id') id) {
        return await this.studyService.StudyListByModule(id);
    }

    @Get('study')
        public async getStudy(@Query('id') id) {
        return await this.studyService.FindStudyByID(id);
    }

    @Get('studybytype?')
    public async getStudybyType(
        @Query('id') id,
        @Query('type_content') type_content,
    ) {
    return await this.studyService.FindStudyByTypeAndID(id,type_content);
}

    @Patch('updateTypeContent')
        public async updateTypeContent(@Body() studyDto:StudyDto) {
        return await this.studyService.updateStudyTypeContent(studyDto);
    }

    @Patch('updateIdContent')
        public async updateIdContent(@Body() studyDto:StudyDto) {
        return await this.studyService.updateStudyIdContent(studyDto);
    }

    @Patch('updateCourseAndModule')
        public async updateCourseAndModule(@Body() studyDto:StudyDto) {
        return await this.studyService.updateStudyCourseAndModule(studyDto);
    }

    @Patch('updateTextContent')
        public async updateTextContent(@Body() textDto:TextDto) {
        return await this.studyService.updateTextStudy(textDto);
    }

    @Patch('updateVideoContent')
        public async updateVideoContent(@Body() videoDto:VideoDto) {
        return await this.studyService.updateVideoStudy(videoDto);
    }

    @Get('getTextContent?')
        public async getTextContent(@Query('id') id) {
        return await this.studyService.GetTextContent(id);
    }

    @Get('getVideoContent')
        public async getVideoContent(@Query('id') id) {
        return await this.studyService.GetVideoContent(id);
    }

    @Post('videoupload')
    @UseInterceptors(FileInterceptor('video', {
        fileFilter:VideoFilter
    }))
        public async videoupload(@UploadedFile() file: Express.Multer.File){
            if(!file){
                const video = {
                    success: 0,
                    error: "File is not a video"
                }
                return video
            } else {
                const id:number = Number(file.originalname.split("*")[0])
                const Study = await this.studyService.FindStudyByID(id)
                return await fetch('https://uploader.kinescope.io/v2/video',
                    {method:'POST',
                    headers:{
                        'Authorization':'Bearer '+process.env.API_KINESCOPE_TOKEN,
                        'X-Parent-ID': Study.id_kinescope_folder,
                        'X-Video-Title':file.originalname.split("*")[1],
                        'X-File-Name': file.originalname.split("*")[1],
                        'X-VIdeo-Description': 'desc'
                    },
                    body:file.buffer
                    })
                    .then(response =>response.json())
                    .then(response => {
                        return response
                    })
                    .catch(err => console.error(err));
            }
        }

    @Post('picload')
    @UseInterceptors(FileInterceptor('image', {
        storage: StudyImageStorage,
        fileFilter:ImageFilter
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

    @Delete('StudyImageDelete')
        public async StudyImageDelete(@Body() path:any) {
        return await this.studyService.DeleteStudyImage(path);
    }

    @Get(':studyid/images/:filename')
    async getImage(@Param('filename') filename, @Param('studyid') studyid , @Res() res:Response) {
        res.sendFile(filename, {root:'./assets/studies/study_'+ studyid});
    }

}
