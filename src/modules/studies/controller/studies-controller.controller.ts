import { Controller, Body, Post, Get} from '@nestjs/common';
import { StudiesServices } from '../service/studies-services.service';
import { CreateStudyDto } from '../dto/study-create.dto';
import { NewStudyStatus } from '../interfaces/NewStudy.interface';
import { StudyDto } from '../dto/study.dto';

@Controller('studies')

export class StudiesController{ 
    constructor(private readonly studyService: StudiesServices) {}

    @Post('newstudy')  
        public async create(@Body() CreateStudyDto: CreateStudyDto): Promise<NewStudyStatus> {
        return await this.studyService.create(CreateStudyDto);  
    }

    @Post('studylist')
    getStudies(@Body() studyDto:StudyDto){
        return this.studyService.StudyListByCreatorID(studyDto);
    }

    @Post('study')
    getStudy(@Body() studyDto:StudyDto){
        return this.studyService.FindstudyByID(studyDto);
    }
}
