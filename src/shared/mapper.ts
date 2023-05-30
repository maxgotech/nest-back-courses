import { UserEntity } from "../modules/user/model/user.entity";
import { UserDto } from "../modules/user/dto/user.dto";
import { StudyDto } from "src/modules/studies/dto/study/study.dto";
import { StudiesEntity } from "src/modules/studies/model/studies.entity";
import { TextEntity } from "src/modules/studies/model/text.entity";
import { TextDto } from "src/modules/studies/dto/text/text.dto";
import { VideoEntity } from "src/modules/studies/model/video.entity";
import { VideoDto } from "src/modules/studies/dto/video/video.dto";
import { CoursesEntity } from "src/modules/courses/model/course.entity";
import { CourseDto } from "src/modules/courses/dto/course/course.dto";
import { ModuleEntity } from "src/modules/courses/model/module.entity";
import { ModuleDto } from "src/modules/courses/dto/module/module.dto";

export const toUserDto = (data: UserEntity): UserDto => {  
    const { id, name, secondname, mail, about } = data;
    let userDto: UserDto = { id, name, secondname, mail, about };
    return userDto;
};

export const toStudyDto = (data: StudiesEntity): StudyDto => {  
    const { id, name, id_content,type_content, user, course, module } = data;
    let studyDto: StudyDto = { id, name, id_content, type_content , user, course, module };
    return studyDto;
};

export const toTextDto = (data: TextEntity): TextDto => {  
    const { id, content } = data;
    let textDto: TextDto = { id, content };
    return textDto;
};

export const toVideoDto = (data: VideoEntity): VideoDto => {  
    const { id, path, length, size } = data;
    let videoDto: VideoDto = { id, path, length, size };
    return videoDto;
};

export const toCourseDto = (data: CoursesEntity): CourseDto => {  
    const { id, name, price, user, image_path } = data;
    let courseDto: CourseDto = { id, name, price, user, image_path };
    return courseDto;
};

export const toModuleDto = (data: ModuleEntity): ModuleDto => {  
    const { id, name, about, course } = data;
    let moduleDto: ModuleDto = {id, name, about, course};
    return moduleDto;
};