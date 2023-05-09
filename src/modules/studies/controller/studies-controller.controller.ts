import { Controller, Body, Post } from '@nestjs/common';
import { StudiesServices } from '../service/studies-services.service';
import { CreateStudyDto } from '../dto/study/study-create.dto';
import { StudyDto } from '../dto/study/study.dto';
import { CreateVideoDto } from '../dto/video/video-create.dto';
import { CreateTextDto } from '../dto/text/text-create.dto';
import { TextDto } from '../dto/text/text.dto';
import { VideoDto } from '../dto/video/video.dto';

@Controller('studies')

export class StudiesController{ 
    constructor(private readonly studyService: StudiesServices) {}

    @Post('newstudy')  
        public async StudyCreate(@Body() CreateStudyDto: CreateStudyDto) {
        return await this.studyService.createStudy(CreateStudyDto);  
    }

    @Post('newtextstudy')  
        public async TextStudyCreate(@Body() CreateTextDto: CreateTextDto) {
        return await this.studyService.createTextStudy(CreateTextDto);  
    }

    @Post('newvideostudy')  
        public async VideoStudyCreate(@Body() CreateVideoDto: CreateVideoDto) {
        return await this.studyService.createVideoStudy(CreateVideoDto);  
    }

    @Post('studylist')
        public async getStudies(@Body() studyDto:StudyDto) {
        return await this.studyService.StudyListByCreatorID(studyDto);
    }

    @Post('study')
        public async getStudy(@Body() studyDto:StudyDto) {
        return await this.studyService.FindstudyByID(studyDto);
    }

    @Post('updateTypeContent')
        public async updateTypeContent(@Body() studyDto:StudyDto) {
        return await this.studyService.updateStudyTypeContent(studyDto);
    }

    @Post('updateIdContent')
        public async updateIdContent(@Body() studyDto:StudyDto) {
        return await this.studyService.updateStudyIdContent(studyDto);
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
}
