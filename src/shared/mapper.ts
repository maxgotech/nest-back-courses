import { UserEntity } from "../modules/user/model/user.entity";
import { UserDto } from "../modules/user/dto/user.dto";

export const toUserDto = (data: UserEntity): UserDto => {  
    const { id, name,secondname, mail } = data;
    let userDto: UserDto = { id, name,secondname, mail,  };
    return userDto;
};