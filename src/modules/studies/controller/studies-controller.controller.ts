import { Controller, Body, Post, UseInterceptors, UploadedFile, Get, Param, Res, Headers, Delete } from '@nestjs/common';
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

    @Post('studybytype')
    public async getStudybyType(@Body() studyDto:StudyDto) {
    return await this.studyService.FindStudyByTypeAndID(studyDto);
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

    @Post('getVideoContent')
        public async getVideoContent(@Body() videoDto:VideoDto) {
        return await this.studyService.GetVideoContent(videoDto);
    }

    @Post('debug')
        public async test(){
        return await this.studyService.test()
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
                const id:StudyDto = {
                    id: Number(file.originalname.split("*")[0]),
                    name: null,
                    id_content: null,
                    type_content: null,
                    id_kinescope_folder: null,
                    user: null,
                    course: null,
                    module: null,
                    order:null
                }
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
