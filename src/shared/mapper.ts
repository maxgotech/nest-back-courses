import { UserEntity } from "../modules/user/model/user.entity";
import { UserDto } from "../modules/user/dto/user.dto";
import { StudyDto } from "src/modules/studies/dto/study.dto";
import { StudiesEntity } from "src/modules/studies/model/studies.entity";

export const toUserDto = (data: UserEntity): UserDto => {  
    const { id, name, secondname, mail, about } = data;
    let userDto: UserDto = { id, name, secondname, mail, about };
    return userDto;
};

export const toStudyDto = (data: StudiesEntity): StudyDto => {  
    const { id, name, id_content,type_content, id_createdBy } = data;
    let studyDto: StudyDto = { id, name, id_content, type_content , id_createdBy };
    return studyDto;
};