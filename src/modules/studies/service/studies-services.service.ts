import { CreateStudyDto } from '../dto/study/study-create.dto';
import { StudiesEntity } from '../model/studies.entity';
import { Injectable, HttpException, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
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
const fs = require('fs');

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
        await this.createStudyFolder(study); //создание папки в проекте
        await this.createKinescopeFolder(study) //создание папки на кинескопе
        .then((response:kinescopefolder) =>{
            study.id_kinescope_folder = response.id
        })
        await this.updateStudyFolderId(study) //добавление id папки на кинескопе к занятию
        return toStudyDto(study);
    }

    async deleteStudy(id: number) {    
        
        // check if the study exists in the db    
        const studyInDb = await this.studyRepo.findOne({ 
            where: { id } 
        });
        if (!studyInDb) {
            throw new NotFoundException('study not found')
        }
        await this.studyRepo.remove(studyInDb); //удаление занятия
        const studyDto:StudyDto={
            id: id,
            name: null,
            study_order: null,
            id_content: null,
            type_content: null,
            id_kinescope_folder: null,
            user: null,
            course: null,
            module: null
        }
        await this.deleteStudyFolder(studyDto) // удаления папки в проекте
        await this.deleteKinescopeFolder(studyInDb) // удаления папки на кинескопе
        return toStudyDto(studyInDb);
    }

    async StudyListByCreatorID(user:any){
        if (user==null){
            throw new BadRequestException('invalid data');
        } else {
            const StudyList = await this.studyRepo
            .createQueryBuilder("study")
            .where({
                "user":user
            })
            .getMany();
            if(StudyList==null){
                throw new NotFoundException('study not found')
            }
        return StudyList.reverse();
    }
    }

    async StudyListByModule(id:any){ //выводить не занятия с модулями а модуль с занятиями (исправить)
        if (id==null){
            throw new BadRequestException('invalid data');
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
        if(StudyListByModule==null){
            throw new NotFoundException('study not found')
        }
        return StudyListByModule;
    }
    }

    async FindStudyByID(id){
        if (id==null){
            throw new BadRequestException('invalid data');
        } else {
        const Study = await this.studyRepo.findOne({ where: { id } });
        if(Study==null){
            throw new NotFoundException('study not found')
        }
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
        if(text==null){
            throw new NotFoundException('text study not found')
        }
        return toTextDto(text);
    }

    async GetVideoContent(videoDto:VideoDto){
        const { id } = videoDto;
        const video = await this.videoRepo.findOne({where:{id}});
        if(video==null){
            throw new NotFoundException('video study not found')
        }
        if(video.id_video==null){
            throw new NotFoundException('video not found')
        }
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

    async deleteStudyFolder(study:StudyDto) {
        const folderName = "assets/studies/study_" + study.id;
        try {
            if (fs.existsSync(folderName)) {
                fs.rmSync(folderName, { recursive: true, force: true });
            }
            } catch (err) {
            console.error(err);
            }
        return 'folder ' + folderName + ' deleted'
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

    async deleteKinescopeFolder(study:StudyDto){

        return fetch('https://api.kinescope.io/v1/projects/' + process.env.API_KINESCOPE_PARENT_ID + '/folders/'+ study.id_kinescope_folder,
        {method:'DELETE',
        headers:{
            'Authorization':'Bearer '+process.env.API_KINESCOPE_TOKEN
        },
        })
        .then(response =>response.json())
        .then(response => {
            return  {
               response
            }
        })
        .catch(err => console.error(err));
    }

    

    async FindStudyByTypeAndID(id,type_content){
        if (id==null){
            throw new BadRequestException('invalid data');
        } else if(type_content==1) {
            const text = await this.textRepo.findOne({ where: { id } });
            if(text==null){
                throw new NotFoundException('text study not found')
            }
            return text;
        } else if(type_content==2) {
            const video = await this.videoRepo.findOne({ where: { id } });
            if (video==null){
                throw new NotFoundException('video study not found')
            }
            if(video.id_video==null){
                throw new NotFoundException('video not found')
            }
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

    async DeleteStudyImage({path}){
       const id = path.split('/')[4]
       const name =  path.split('/')[6]
       const dir = './assets/studies/study_'+ id + '/' + name
       await fs.unlink(dir, (err) => {
        if (err) {
            throw err;
        }
        console.log("Delete File successfully.");
        });

       return ({'deleted':dir})
    }

}
