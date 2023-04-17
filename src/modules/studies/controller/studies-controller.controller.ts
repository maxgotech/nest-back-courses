import { Controller, Body, Post} from '@nestjs/common';
import { StudiesServices } from '../service/studies-services.service';
import { CreateStudyDto } from '../dto/study-create.dto';
import { NewStudyStatus } from '../interfaces/NewStudy.interface';

@Controller('studies')

export class StudiesController{ 
    constructor(private readonly studyService: StudiesServices) {}

    @Post('newstudy')  
        public async login(@Body() CreateStudyDto: CreateStudyDto): Promise<NewStudyStatus> {
        return await this.studyService.create(CreateStudyDto);  
    }
    
}
