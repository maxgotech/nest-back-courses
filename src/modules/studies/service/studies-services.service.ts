import { CreateStudyDto } from '../dto/study/study-create.dto';
import { StudiesEntity } from '../model/studies.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyDto } from '../dto/study/study.dto';
import { toStudyDto, toTextDto, toVideoDto } from 'src/shared/mapper';
import { CreateVideoDto } from '../dto/video/video-create.dto';
import { VideoDto } from '../dto/video/video.dto';
import { VideoEntity } from '../model/video.entity';
import { TextEntity } from '../model/text.entity';
import { CreateTextDto } from '../dto/text/text-create.dto';
import { TextDto } from '../dto/text/text.dto';

@Injectable()
export class StudiesServices { 

    constructor( 
        @InjectRepository(StudiesEntity) private readonly studyRepo: Repository<StudiesEntity>,
        @InjectRepository(VideoEntity) private readonly videoRepo: Repository<VideoEntity>,
        @InjectRepository(TextEntity) private readonly textRepo: Repository<TextEntity>
        ){}

    async findOne(options?: object): Promise<StudyDto> {
        const study =  await this.studyRepo.findOne(options);    
        return toStudyDto(study);  
    }

    async createStudy(studyDto: CreateStudyDto): Promise<StudyDto> {    
        const { name, user  } = studyDto;
        
        // check if the study exists in the db    
        const studyInDb = await this.studyRepo.findOne({ 
            where: { name } 
        });
        if (studyInDb) {
            throw new HttpException('Study already exists', HttpStatus.BAD_REQUEST);    
        }
        
        const study: StudiesEntity = await this.studyRepo.create({ name, user });
        await this.studyRepo.save(study);
        return toStudyDto(study);
    }

    async deleteStudy(studyDto: StudyDto) {    
        const { id  } = studyDto;
        
        // check if the study exists in the db    
        const studyInDb = await this.studyRepo.findOne({ 
            where: { id } 
        });
        if (!studyInDb) {
            throw new HttpException('Study not found', HttpStatus.BAD_REQUEST);    
        }
        await this.studyRepo.remove(studyInDb);

        return ('study '+ id + ' deleted');
    }

    async StudyListByCreatorID({ user }: StudyDto){
        if (user==null){
            return;
        } else {
            const StudyList = await this.studyRepo
            .createQueryBuilder("study")
            .where({
                "user":user
            })
            .getMany();
        return StudyList.reverse();
    }
    }

    async StudyListByModule({ id }){
        if (id==null){
            return;
        } else {
        const StudyListByModule = await this.studyRepo.find({
            relations:{
                module:true,
            },
            where:{
                module:{
                    id:id
                }
            }
        });
        return StudyListByModule;
    }
    }

    async FindStudyByID({id}:StudyDto){
        if (id==null){
            return;
        } else {
        const Study = await this.studyRepo.findOne({ where: { id } });
        return toStudyDto(Study);
    }
    }

    async updateStudyTypeContent(studyDto: StudyDto): Promise<StudyDto> {    
        const { id, type_content  } = studyDto;
        await this.studyRepo.save({id:id,type_content:type_content})
        const Study = await this.studyRepo.findOne({ where: { id } });
        return toStudyDto(Study);
    }

    async updateStudyIdContent(studyDto: StudyDto): Promise<StudyDto> {    
        const { id, id_content  } = studyDto;
        await this.studyRepo.save({id:id,id_content:id_content})
        const Study = await this.studyRepo.findOne({ where: { id } });
        return toStudyDto(Study);
    }

    async updateStudyCourseAndModule(studyDto: StudyDto): Promise<StudyDto> {    
        const { id, course, module  } = studyDto;
        await this.studyRepo.save({id:id,course:course,module:module})
        const Study = await this.studyRepo.findOne({relations:['module','course'], where: { id } });
        return toStudyDto(Study);
    }

    async createVideoStudy(videoDto: CreateVideoDto): Promise<VideoDto> {    
        const { path, length, size  } = videoDto;
        
        const video: VideoEntity = await this.videoRepo.create({ path, length,size });
        await this.videoRepo.save(video);
        return toVideoDto(video);
    }

    async createTextStudy(textDto: CreateTextDto): Promise<TextDto> {    
        const { content  } = textDto;
        
        const text: TextEntity = await this.textRepo.create({ content });
        await this.textRepo.save(text);
        return toTextDto(text);
    }

    async updateVideoStudy(videoDto: VideoDto): Promise<VideoDto> {    
        const { id, path, length, size  } = videoDto;
        await this.videoRepo.save({id:id,path:path,length:length,size:size});
        const video = await this.videoRepo.findOne({where:{id}});
        return toVideoDto(video);
    }

    async updateTextStudy(textDto: TextDto): Promise<TextDto> {    
        const { id, content  } = textDto;
        await this.textRepo.save({id:id,content:content});
        const text = await this.textRepo.findOne({where:{id}});
        return toTextDto(text);
    }

    async GetTextContent(textDto:TextDto): Promise<TextDto>{
        const { id } = textDto;
        const text = await this.textRepo.findOne({where:{id}});
        return toTextDto(text);
    }

}
