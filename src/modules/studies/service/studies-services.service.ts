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
import { CreateStudyFolderDto } from '../dto/study/study-folder.dto';
import { kinescopefolder } from '../dto/video/video-folder.dto';


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
        const study: StudiesEntity = await this.studyRepo.create({ name, user });
        await this.studyRepo.save(study);
        await this.createStudyFolder(study); //создание папки
        await this.createKinescopeFolder(study)
        .then((response:kinescopefolder) =>{
            study.id_kinescope_folder = response.id
        })
        await this.updateStudyFolderId(study)
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

        return toStudyDto(studyInDb);
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

    async StudyListByModule({ id }){ //выводить не занятия с модулями а модуль с занятиями (исправить)
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

    async updateStudyFolderId(studyDto: StudyDto): Promise<StudyDto> {    
        const { id, id_kinescope_folder  } = studyDto;
        await this.studyRepo.createQueryBuilder()
        .update()
        .set({id_kinescope_folder:id_kinescope_folder})
        .where("id=:id",{id:id})
        .execute()
        const Study = await this.studyRepo.findOne({ where: { id } });
        return toStudyDto(Study);
    }

    async updateStudyTypeContent(studyDto: StudyDto): Promise<StudyDto> {    
        const { id, type_content  } = studyDto;
        await this.studyRepo.createQueryBuilder()
        .update()
        .set({type_content:type_content})
        .where("id=:id",{id:id})
        .execute()
        const Study = await this.studyRepo.findOne({ where: { id } });
        return toStudyDto(Study);
    }

    async updateStudyIdContent(studyDto: StudyDto): Promise<StudyDto> {    
        const { id, id_content  } = studyDto;
        await this.studyRepo.createQueryBuilder()
        .update()
        .set({id_content:id_content})
        .where("id=:id",{id:id})
        .execute()
        const Study = await this.studyRepo.findOne({ where: { id } });
        return toStudyDto(Study);
    }

    async updateStudyCourseAndModule(studyDto: StudyDto): Promise<StudyDto> {    
        const { id, course, module  } = studyDto;
        await this.studyRepo.createQueryBuilder()
        .update()
        .set({course:course, module:module})
        .where("id=:id",{id:id})
        .execute()
        const Study = await this.studyRepo.findOne({relations:['module','course'], where: { id } });
        return toStudyDto(Study);
    }

    async createVideoStudy(videoDto: CreateVideoDto): Promise<VideoDto> {    
        const { id_video } = videoDto;
        
        const video: VideoEntity = await this.videoRepo.create({ id_video });
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
        const { id, id_video } = videoDto;
        const videoStudy = await this.videoRepo.findOne({where:{id}});
        await fetch('https://api.kinescope.io/v1/videos/'+videoStudy.id_video,
        {method:'DELETE',
        headers:{
            'Authorization':'Bearer '+process.env.API_KINESCOPE_TOKEN
        },
        })
        .then(response =>response.json())
        .then(response => {
            console.log(response)
        })
        .catch(err => console.error(err));
        
        await this.videoRepo.createQueryBuilder()
        .update()
        .set({id_video:id_video})
        .where("id=:id",{id:id})
        .execute()
        const video = await this.videoRepo.findOne({where:{id}});
        return toVideoDto(video);
    }

    async updateTextStudy(textDto: TextDto): Promise<TextDto> {    
        const { id, content  } = textDto;
        await this.textRepo.createQueryBuilder()
        .update()
        .set({content:content})
        .where("id=:id",{id:id})
        .execute()
        const text = await this.textRepo.findOne({where:{id}});
        return toTextDto(text);
    }

    async GetTextContent(textDto:TextDto): Promise<TextDto>{
        const { id } = textDto;
        const text = await this.textRepo.findOne({where:{id}});
        return toTextDto(text);
    }

    async GetVideoContent(videoDto:VideoDto){
        const { id } = videoDto;
        const video = await this.videoRepo.findOne({where:{id}});

        return fetch('https://api.kinescope.io/v1/videos/'+video.id_video,
        {method:'GET',
        headers:{
            'Authorization':'Bearer '+process.env.API_KINESCOPE_TOKEN
        }})
        .then(response =>response.json())
        .then(response => {
            return  {
                video_link:response.data.assets[0].url
            }
        })
		.catch(err => console.error(err));
    }
    

    async createStudyFolder(createStudyFolder:CreateStudyFolderDto){
        const fs = require('fs');
        const folderName = "assets/studies/study_" + createStudyFolder.id;

        try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
        } catch (err) {
        console.error(err);
        }
        return folderName
    }

    async createKinescopeFolder(createStudyFolder:CreateStudyFolderDto){
        const folderName = "study_" + createStudyFolder.id;
        const data = {
            'name': folderName
        }
        return fetch('https://api.kinescope.io/v1/projects/'+process.env.API_KINESCOPE_PARENT_ID+'/folders',
            {method:'POST',
            headers:{
                'Authorization':'Bearer '+process.env.API_KINESCOPE_TOKEN
            },
            body:JSON.stringify(data)
            })
            .then(response =>response.json())
            .then(response => {
                return  {
                    name:response.data.name,
                    id:response.data.id
                }
            })
            .catch(err => console.error(err));
    }

    async FindStudyByTypeAndID({id,type_content}:StudyDto){
        if (id==null){
            return;
        } else if(type_content==1) {
            const text = await this.textRepo.findOne({ where: { id } });
            return text;
        } else if(type_content==2) {
            const video = await this.videoRepo.findOne({ where: { id } });
            return fetch('https://api.kinescope.io/v1/videos/'+video.id_video,
            {method:'GET',
            headers:{
                'Authorization':'Bearer '+process.env.API_KINESCOPE_TOKEN
            }})
            .then(response =>response.json())
            .then(response => {
                return  {
                    video_link:response.data.embed_link
                }
            })
            .catch(err => console.error(err));
        }
    }

    async test(){
        return fetch('https://api.kinescope.io/v1/projects?per_page=100',
        {method:'GET',
        headers:{
            'Authorization':'Bearer ba52ddc9-7645-4bd5-8d81-ad697e06b5f7'
        }})
        .then(response =>response.json())
        .then(response => console.log(response))
		.catch(err => console.error(err));
    }

}
