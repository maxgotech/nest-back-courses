import { CreateStudyDto } from '../dto/study-create.dto';
import { StudiesEntity } from '../model/studies.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyDto } from '../dto/study.dto';
import { toStudyDto } from 'src/shared/mapper';

@Injectable()
export class StudiesServices { 

    constructor( @InjectRepository(StudiesEntity) private readonly studyRepo: Repository<StudiesEntity>){}

    async findOne(options?: object): Promise<StudyDto> {
        const study =  await this.studyRepo.findOne(options);    
        return toStudyDto(study);  
    }

    async create(studyDto: CreateStudyDto): Promise<StudyDto> {    
        const { name, id_createdBy  } = studyDto;
        
        // check if the study exists in the db    
        const studyInDb = await this.studyRepo.findOne({ 
            where: { name } 
        });
        if (studyInDb) {
            throw new HttpException('Study already exists', HttpStatus.BAD_REQUEST);    
        }
        
        const study: StudiesEntity = await this.studyRepo.create({ name, id_createdBy });
        await this.studyRepo.save(study);
        return toStudyDto(study);
    }
}
